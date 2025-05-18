document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('pinnedChats', (data) => {
      const list = document.getElementById('pin-list');
      (data.pinnedChats || []).forEach(({ title, url }) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.textContent = title;
        link.target = "_blank";
        li.appendChild(link);
        list.appendChild(li);
      });
    });
  });
  