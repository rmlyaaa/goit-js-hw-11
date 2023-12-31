import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', function () {
  var loadMoreButton = document.querySelector('.load-more');
  loadMoreButton.style.display = 'none';

  var form = document.getElementById('search-form');
  var gallery = document.querySelector('.gallery');
  var page = 1;
  var searchQuery = '';
  var totalHits = 0;
  var totalPages = 0;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    searchQuery = e.target.searchQuery.value.trim();
    if (isValidSearchQuery(searchQuery)) {
      await fetchImages();
    } else {
      Notiflix.Notify.failure(
        'Будь ласка, введіть коректний запит для пошуку зображень.'
      );
      loadMoreButton.style.display = 'none';
    }
  });

  loadMoreButton.addEventListener('click', async function () {
    page++;
    await fetchImages();
  });

  async function fetchImages() {
    const apiKey = '39751555-c2fbc931ac716611d03f33f4d';
    const perPage = 40;
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'На жаль, за вашим запитом не знайдено зображень. Будь ласка, спробуйте ще раз.'
        );
        loadMoreButton.style.display = 'none';
      } else {
        totalHits = data.totalHits;
        totalPages = Math.ceil(totalHits / perPage);

        data.hits.forEach(function (image, index) {
          const card = document.createElement('div');
          card.classList.add('photo-card');
          card.innerHTML = `
            <a href="${image.largeImageURL}" data-lightbox="image-${index}" data-title="${image.tags}">
              <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item"><b>Лайки:</b> ${image.likes}</p>
              <p class="info-item"><b>Перегляди:</b> ${image.views}</p>
              <p class="info-item"><b>Коментарі:</b> ${image.comments}</p>
              <p class="info-item"><b>Завантаження:</b> ${image.downloads}</p>
            </div>
          `;
          gallery.appendChild(card);
        });

        if (page < totalPages) {
          loadMoreButton.style.display = 'block';
        } else {
          Notiflix.Notify.success('Ви доскроллили до кінця! Вітаю!.');
          loadMoreButton.style.display = 'none';
        }

        // Оновлений код для SimpleLightbox
        var lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'title',
          captionDelay: 250,
        });
      }
    } catch (error) {
      console.error('Помилка при отриманні зображень:', error);
    }
  }

  function isValidSearchQuery(query) {
    return query.length > 0;
  }
});
