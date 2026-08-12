document.getElementById("year").textContent = new Date().getFullYear();

const GITHUB_USER = "adam-ajroudi";
const MAX_PROJECTS = 6;

async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`
    );
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = await res.json();

    const featured = repos
      .filter((r) => !r.fork && !r.archived && r.name !== GITHUB_USER)
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.pushed_at) - new Date(a.pushed_at);
      })
      .slice(0, MAX_PROJECTS);

    if (featured.length === 0) {
      grid.innerHTML = '<p class="loading">No public projects yet.</p>';
      return;
    }

    grid.innerHTML = featured.map(renderCard).join("");
  } catch (err) {
    grid.innerHTML = `<p class="error">Couldn't load projects right now — see them directly on <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">GitHub</a>.</p>`;
  }
}

function renderCard(repo) {
  const description = repo.description || "No description yet.";
  const meta = [];
  if (repo.language) meta.push(escapeHtml(repo.language));
  if (repo.stargazers_count > 0) meta.push(`★ ${repo.stargazers_count}`);

  return `
    <div class="card">
      <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHtml(repo.name)}</a></h3>
      <p>${escapeHtml(description)}</p>
      <div class="card-meta">${meta.map((m) => `<span>${m}</span>`).join("")}</div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadProjects();
