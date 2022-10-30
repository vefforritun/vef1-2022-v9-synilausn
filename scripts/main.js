import { empty } from './lib/helpers.js';
import {
  createSearchInput,
  fetchAndRenderBook,
  renderFrontpage,
  searchAndRender,
} from './lib/ui.js';

const header = document.querySelector('.layout__header');
const main = document.querySelector('.layout__main');

async function onSearch(e) {
  e.preventDefault();

  const { value } = e.target.querySelector('input');

  if (!value) {
    return;
  }

  await searchAndRender(main, e.target, value);

  window.history.pushState({}, '', `/?query=${value}`);
}

const searchForm = createSearchInput(onSearch);

header.appendChild(searchForm);

/**
 * Athugar hvaða síðu við erum á út frá query-string og birtir viðeigandi
 * gögn. Ef `id` er gefið er bók birt, ef `query` er gefið er leitarniðurstaða
 * birt, annars er forsíða birt.
 */
function route() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const query = params.get('query');

  if (id) {
    fetchAndRenderBook(main, searchForm, id);
  } else if (query) {
    searchAndRender(main, searchForm, query);
  } else {
    renderFrontpage(main);
  }
}

/**
 * Bregst við því þegar við notum vafra til að fara til baka eða áfram.
 */
window.onpopstate = () => {
  empty(main);
  route();
};

// Athugum í byrjun hvað eigi að birta.
route();
