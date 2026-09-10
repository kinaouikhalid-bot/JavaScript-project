const STORAGE_KEY = 'entries';

const sampleEntries = [
  {
    id: 1,
    title: 'First Studio Review',
    body: 'The first review changed how I approached process. Instead of treating every idea as final, I learned to present earlier and let the structure guide the story.',
    createdAt: '2026-08-10T10:00:00.000Z'
  },
  {
    id: 2,
    title: 'Designing for Clarity',
    body: 'I spent the week revisiting layout decisions. A clearer hierarchy and calmer spacing made the interface feel more confident without adding clutter.',
    createdAt: '2026-08-16T12:00:00.000Z'
  },
  {
    id: 3,
    title: 'Material Storytelling',
    body: 'The best concept work always starts with materials. Choosing the right palette and texture changes how the project feels before a single pixel is polished.',
    createdAt: '2026-08-22T15:00:00.000Z'
  },
  {
    id: 4,
    title: 'The Power of Constraints',
    body: 'The challenge this week was not reducing ambition but focusing it. Constraints pushed the work toward a simpler, more intentional solution.',
    createdAt: '2026-08-26T18:00:00.000Z'
  },
  {
    id: 5,
    title: 'Small Iterations',
    body: 'The final result rarely comes from one dramatic leap. It comes from a series of small adjustments that gradually build trust and refinement.',
    createdAt: '2026-09-01T09:00:00.000Z'
  }
];

const getEntries = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEntries));
    return [...sampleEntries];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Could not parse saved entries.', error);
    return [];
  }
};

const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const renderHomeEntries = () => {
  const grid = document.querySelector('#entry-grid');
  const count = document.querySelector('#entry-count');

  if (!grid) {
    return;
  }

  const entries = getEntries();
  const recentEntries = entries.slice(0, 5);
  grid.innerHTML = '';

  recentEntries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'entry-card';
    card.innerHTML = `
      <p class="date">${formatDate(entry.createdAt)}</p>
      <h3>${escapeHtml(entry.title || 'Untitled Entry')}</h3>
      <p>${escapeHtml(entry.body || 'No reflection added yet.')}</p>
    `;
    grid.appendChild(card);
  });

  if (count) {
    count.textContent = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;
  }
};

const renderVaultEntries = () => {
  const vaultList = document.querySelector('#vault-list');

  if (!vaultList) {
    return;
  }

  const entries = getEntries();
  vaultList.innerHTML = '';

  if (!entries.length) {
    vaultList.innerHTML = '<div class="empty-state">No entries yet. Write your first reflection.</div>';
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'vault-row';
    row.innerHTML = `
      <div>
        <p class="meta">${formatDate(entry.createdAt)}</p>
      </div>
      <div>
        <h3>${escapeHtml(entry.title || 'Untitled Entry')}</h3>
        <p>${escapeHtml(entry.body || 'No reflection added yet.')}</p>
      </div>
    `;
    vaultList.appendChild(row);
  });
};

const initializeEntryForm = () => {
  const form = document.querySelector('#entry-form');
  const titleInput = document.querySelector('#entry-title');
  const bodyInput = document.querySelector('#entry-body');
  const saveButton = document.querySelector('#save-entry');

  if (!form || !titleInput || !bodyInput || !saveButton) {
    return;
  }

  saveButton.addEventListener('click', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    console.log('Title:', title);
    console.log('Reflection:', body);

    if (!title || !body) {
      alert('Please add both a title and your reflection before saving.');
      return;
    }

    const entries = getEntries();
    entries.push({
      id: Date.now(),
      title,
      body,
      createdAt: new Date().toISOString()
    });

    saveEntries(entries);
    form.reset();
    window.location.href = 'index.html';
  });
};

document.addEventListener('DOMContentLoaded', () => {
  renderHomeEntries();
  renderVaultEntries();
  initializeEntryForm();
});
