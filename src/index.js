import './css/styles.css';
import { fetchCountries } from './fetch-countries.js';
import Notiflix from 'notiflix';
import debounce from "lodash.debounce";

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput : document.querySelector('#search-box'),
  countryList : document.querySelector('.country-list'),
  countryInfo : document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(event) {
   event.preventDefault();

  const searchValue = event.target.value;

  const name = searchValue.toLowerCase().trim();;

  if( name === "") {
    return (refs.countryInfo.innerHTML = ''), (refs.countryList.innerHTML = "");
    } 
    fetchCountries(name)
    .then(countries => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      if (countries.length === 1) {
     refs.countryList.insertAdjacentHTML(
       'beforeend',renderCountryList(countries));
     refs.countryInfo.insertAdjacentHTML(
      'beforeend', renderCountryInfo(countries));
     } else if (countries.length >= 10) {
        alertTooManyCountries();
     }  else {
        refs.countryList.insertAdjacentHTML( 'beforeend',renderCountryList(countries));
    }})
  .catch(alertWrongName);
};

function renderCountryList (countries) {
  const markupList = countries.map((country) => {
   return `<li class="country-list__item">
   <img class="country-list__flag" src="${country.flags.svg}" width = 30px height = 30px>
   <h2 class="country-list__name">${country.name}</h2></li>`
}).join("");

  return markupList;
};

function renderCountryInfo (countries) {
  const markupInfo = countries.map((country) => {
    const languages = country.languages.map(language => { return language.name }).join(', ');
    return `<ul class="country-info-list"><li><p class="country-list__text" ><b>Capital</b>: ${country.capital}</p></li>
    <li> <p class="country-list__text"><b>Population</b>: ${country.population}</p></li>
    <li><p class="country-list__text"><b>Languages</b>:&nbsp;${languages}</p></li></ul>`;
   }).join("");

  return markupInfo;
};

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};

function alertTooManyCountries() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
};