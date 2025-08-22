document.addEventListener("DOMContentLoaded", () => {
    // Redirect to login if not logged in
    if (!localStorage.getItem("user")) {
      alert("Please login first");
      window.location.href = "index.html";
    }
  
    const breedsGrid = document.getElementById("breedsGrid");
    const searchInput = document.getElementById("search");
    const loadMoreBtn = document.getElementById("loadMore");
  
    let allBreeds = [];
    let displayedBreeds = [];
    let currentIndex = 0;
    const pageSize = 24;
  
    // Fetch all breeds
    async function fetchBreeds() {
      try {
        const res = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await res.json();
  
        allBreeds = [];
        for (const [breed, subBreeds] of Object.entries(data.message)) {
          if (subBreeds.length === 0) {
            allBreeds.push({ breed, sub: null });
          } else {
            subBreeds.forEach(sub => allBreeds.push({ breed, sub }));
          }
        }
  
        displayedBreeds = allBreeds;
        renderBreeds(); // initial render
      } catch (err) {
        console.error("Failed to fetch breeds", err);
      }
    }
  
    // Render breeds in grid
    async function renderBreeds(reset = true) {
      if (reset) {
        breedsGrid.innerHTML = "";
        currentIndex = 0;
      }
  
      const slice = displayedBreeds.slice(currentIndex, currentIndex + pageSize);
  
      for (const item of slice) {
        const { breed, sub } = item;
        let imgUrl = "";
        try {
          const apiUrl = sub
            ? `https://dog.ceo/api/breed/${breed}/${sub}/images/random`
            : `https://dog.ceo/api/breed/${breed}/images/random`;
  
          const res = await fetch(apiUrl);
          const imgData = await res.json();
          if (imgData.status === "success") imgUrl = imgData.message;
        } catch (e) {
          console.error(`Failed to fetch image for ${breed}`, e);
        }
  
        const card = document.createElement("div");
        card.classList.add("breed-card");
        card.innerHTML = `
          <div class="img-container">
            <img src="${imgUrl}" alt="${sub ? sub + ' ' + breed : breed}" loading="lazy"/>
          </div>
          <h3>${sub ? sub + ' ' + breed : breed}</h3>
        `;
        breedsGrid.appendChild(card);
      }
  
      currentIndex += pageSize;
      loadMoreBtn.style.display = currentIndex < displayedBreeds.length ? "block" : "none";
    }
  
    // Search functionality
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      displayedBreeds = allBreeds.filter(
        item => (item.sub ? item.sub + ' ' + item.breed : item.breed).toLowerCase().includes(query)
      );
      renderBreeds();
    });
  
    // Load more button
    loadMoreBtn.addEventListener("click", () => renderBreeds(false));
  
    // Initial fetch
    fetchBreeds();
  });
  