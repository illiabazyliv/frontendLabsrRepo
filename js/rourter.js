let pageUrls = {
    about: '/index.html?about',
    contact:'/index.html?contact',
    gallery:'/index.html?gallery'
};
function OnStartUp() {
    popStateHandler();
}
OnStartUp();

document.querySelector('#about-link').addEventListener('click', () => {
    changePage('about', 'About', RenderAboutPage);
});

document.querySelector('#contact-link').addEventListener('click', () => {
    changePage('contact', 'Contact', RenderContactPage);
});

document.querySelector('#gallery-link').addEventListener('click', () => {
    changePage('gallery', 'Gallery', RenderGalleryPage);
});

function changePage(page, title, renderFn) {
    let stateObj = { page };
    document.title = title;
    history.pushState(stateObj, title, `?${page}`);
    renderFn();
}

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">About Me</h1>
        <p>Lorem Ipsum is simply dummy text of the printing...</p>
    `;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>

        <form id="contact-form">
            <label>Name:</label>
            <input type="text" id="name" required>

            <label>Email:</label>
            <input type="email" id="email" required>

            <label>Message:</label>
            <textarea id="message" required></textarea>

            <button type="submit">Send</button>
        </form>
    `;

    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Form submitted!');
    });
}

function RenderGalleryPage() {
    const images = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/300?random=${i}`);

    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div class="gallery-grid">
            ${images.map((src, i) =>
                `<img class="gallery-img" data-src="${src}" alt="img${i}">`
            ).join('')}
        </div>
    `;

    setupLazyLoading();
    setupModal();
}

function setupLazyLoading() {
    const imgs = document.querySelectorAll('.gallery-img');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                obs.unobserve(img);
            }
        });
    });

    imgs.forEach(img => observer.observe(img));
}


function setupModal() {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const close = document.getElementById('close-modal');

    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modalImg.src = img.src;
        });
    });

    close.onclick = () => modal.classList.add('hidden');
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    };
}


function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];

    if (loc === pageUrls.contact) RenderContactPage();
    else if (loc === pageUrls.about) RenderAboutPage();
    else if (loc === pageUrls.gallery) RenderGalleryPage();
}
function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div id="gallery" class="gallery-grid">
            <p>Loading images...</p>
        </div>
    `;

    loadGalleryImages();
}
async function loadGalleryImages() {
    const gallery = document.getElementById('gallery');

    try {
        const response = await fetch("https://picsum.photos/v2/list?page=1&limit=9");
        const data = await response.json();

        gallery.innerHTML = "";
        data.forEach(photo => {
            const img = document.createElement("img");
            img.classList.add("gallery-img");

            img.dataset.src = `https://picsum.photos/id/${photo.id}/300/300`;
            img.alt = photo.author;

            gallery.appendChild(img);
        });

        setupLazyLoading();
        setupModal();

    } catch (err) {
        gallery.innerHTML = "<p>Error loading images 😢</p>";
        console.error("Gallery error:", err);
    }
}


document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
