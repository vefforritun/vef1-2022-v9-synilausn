import { getBook, searchBooks } from './books.js';
import { empty, el } from './helpers.js';

/**
 * Setur „loading state“ skilabað meðan gögn eru sótt.
 * @param {element} main Element sem á að birta skilbaoð í.
 * @param {element} searchForm Leitarform sem á að gera óvirkt.
 */
function setLoading(main, searchForm) {
  searchForm.setAttribute('disabled', true);
  empty(main);
  main.appendChild(el('p', {}, 'Sæki gögn...'));
}

/**
 * Fjarlægir „loading state“.
 * @param {element} main Element sem á að tæma.
 * @param {element} searchForm Leitarform sem á að gera virkt.
 */
function setNotLoading(main, searchForm) {
  searchForm.removeAttribute('disabled');
  empty(main);
}

/**
 * Útbýr leitarform og skilar elementi.
 * @param {function} searchHandler Event handler fyrir leit.
 * @returns Element fyrir leitarform.
 */
export function createSearchInput(searchHandler) {
  const search = el('input', { type: 'search', placeholder: 'Heiti bókar' });
  const button = el('button', {}, 'Leita');

  const container = el('form', { class: 'search' }, search, button);
  container.addEventListener('submit', searchHandler);
  return container;
}

/**
 * Útbýr leitarniðurstöðu með titli, höfundum og ártali þegar bók var fyrst
 * útgefin. Titill er hlekkur yfir á nánari upplýsingar um bókina.
 * @param {object} book Bók sem á að birta leitarniðurstöðu fyrir.
 * @returns Elementi fyrir leitarniðurstöðu.
 */
export function createSearchResult(book) {
  return el(
    'div',
    { class: 'result' },
    el('h2', { class: 'result__title' }, el('a', { href: `/?id=${book.id}` }, book.title)),
    el('p', { class: 'result__authors' }, `Eftir ${book.authors.join(', ')}`),
    el('p', { class: 'result__published' }, `Fyrst útgefin ${book.published}`),
  );
}

/**
 * Útbýr leitarniðurstöður fyrir leit, birtir eftir hverju var leitað, hvort
 * ekkert hafi fundist, annars listi af niðurstöðum.
 * @param {Array<object>} books Fylki af bókum sem á að birta, gæti verið tómt.
 * @param {string} query Strengur sem leitað var eftir.
 * @returns Elementi með leitarniðurstöðum.
 */
export function createSearchResults(books, query) {
  const results = el('ul', { class: 'results__container' });
  results.appendChild(el('h1', { class: 'results__title' }, `Leitarniðurstöður fyrir: ${query}`));

  if (books.length === 0) {
    results.appendChild(el('p', { class: 'results__empty' }, 'Ekkert fannst'));
  }

  for (const book of books) {
    const bookEl = el('li', { class: 'results__result' }, createSearchResult(book));
    results.appendChild(bookEl);
  }

  const container = el('div', { class: 'results' }, results);
  return container;
}

/**
 * Útbýr element fyrir öll gögn um bók. Birtir titil fyrir þau gögn sem eru til
 * staðar (ekki tóm fylki) og birtir þau.
 * @param {object} book Gögn fyrir bók sem á að birta.
 * @returns Element sem inniheldur öll gögn um bók.
 */
export function createBook(book) {
  const bookEl = el('div', { class: 'book' }, el('h2', { class: 'book__title' }, book.title));

  if (book.cover) {
    bookEl.appendChild(el('img', { class: 'book__details', src: book.cover }));
  }

  if (book.people.length > 0) {
    const people = el('ul');
    for (const place of book.people) {
      people.appendChild(el('li', {}, place));
    }
    bookEl.appendChild(el('div', { class: 'book__details' }, el('h3', {}, 'Fólk'), people));
  }

  if (book.subjects.length > 0) {
    const subjects = el('ul');
    for (const place of book.subjects) {
      subjects.appendChild(el('li', {}, place));
    }
    bookEl.appendChild(
      el('div', { class: 'book__details' }, el('h3', {}, 'Umfjöllunarefni'), subjects),
    );
  }

  if (book.places.length > 0) {
    const places = el('ul');
    for (const place of book.places) {
      places.appendChild(el('li', {}, place));
    }
    bookEl.appendChild(el('div', { class: 'book__places' }, el('h3', {}, 'Staðir'), places));
  }

  return bookEl;
}

/**
 * Sækir gögn um bók og birtir þau.
 * @param {element} main Element sem á að birta bók í.
 * @param {element} button Leitarform sem á að gera óvirkt meðan bók er sótt.
 * @param {string} id Auðkenni á bók.
 */
export async function fetchAndRenderBook(main, searchForm, id) {
  setLoading(main, searchForm);
  const book = await getBook(id);
  setNotLoading(main, searchForm);

  if (!book) {
    main.appendChild(el('p', {}, 'Engin bók fannst.'));
    return;
  }

  main.appendChild(createBook(book));
}

/**
 * Sækir leitarniðurstöður og birtir þær.
 * @param {element} main Element sem á að birta leitarniðurstöður í.
 * @param {element} button Leitarform sem á að gera óvirkt meðan gögn eru sótt.
 * @param {string} query Leitarstrengur.
 */
export async function searchAndRender(main, searchForm, query) {
  const button = searchForm.querySelector('button');

  setLoading(main, button);
  const results = await searchBooks(query);
  setNotLoading(main, button);

  const resultsEl = createSearchResults(results, query);

  main.appendChild(resultsEl);
}

/**
 * Birtir upplýsingar á forsíðu.
 * @param {element} main Element sem á að birta upplýsingar í.
 */
export function renderFrontpage(main) {
  main.appendChild(el('p', {}, 'Þessi bókaleit notar gögn frá Open Library API.'));
}
