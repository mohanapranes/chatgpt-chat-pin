function renderPinnedChats() {
    const historyContainer = document.getElementById('history');
    if (!historyContainer) return;
  
    chrome.storage.sync.get({ pinnedChats: [] }, (data) => {
      const pinnedChats = data.pinnedChats || [];
  
      // Remove existing pinned section to avoid duplication
      const oldSection = document.getElementById('pinned-section');
      if (oldSection) oldSection.remove();
  
      // Create pinned section container
      const pinnedSection = document.createElement('div');
      pinnedSection.id = 'pinned-section';
      pinnedSection.className = 'flex flex-col gap-2 mt-4';
      
      const header = document.createElement('div');
      header.textContent = '📌 Pinned';
      header.className = 'text-xs text-gray-500 uppercase px-2';
      pinnedSection.appendChild(header);
  
      // Append each pinned chat
      pinnedChats.forEach(chat => {
        const link = document.createElement('a');
        link.href = chat.url;
        link.className = 'flex items-center px-2 py-1 rounded hover:bg-gray-700 text-sm text-white';
        link.style.textDecoration = 'none';
  
        const pinIcon = document.createElement('span');
        pinIcon.textContent = '📌';
        pinIcon.style.marginRight = '6px';
  
        const titleSpan = document.createElement('span');
        titleSpan.textContent = chat.title;
  
        link.appendChild(pinIcon);
        link.appendChild(titleSpan);
  
        pinnedSection.appendChild(link);
      });
  
      // Insert before "Today" or at top
      const todayHeader = [...historyContainer.children].find(el => el.textContent?.trim().toLowerCase() === 'today');
  
      if (todayHeader) {
        historyContainer.insertBefore(pinnedSection, todayHeader.parentElement);
      } else {
        historyContainer.prepend(pinnedSection);
      }
    });
  }
  
function injectPinButtons() {
    const historyContainer = document.getElementById('history');
    if (!historyContainer) return;
  
    const chatLinks = historyContainer.querySelectorAll('a[href^="/c/"]');
  
    chrome.storage.sync.get({ pinnedChats: [] }, (data) => {
      const pinnedChats = data.pinnedChats || [];
  
      chatLinks.forEach(link => {
        const titleNode = link.querySelector('div');
        if (!titleNode || titleNode.querySelector('.pin-btn')) return;
  
        const chatTitle = titleNode.innerText.trim() || 'Untitled';
        const chatURL = link.href;
  
        const isPinned = pinnedChats.some(c => c.url === chatURL);
  
        const btn = document.createElement('button');
        btn.textContent = isPinned ? '📌' : '📍'; // filled vs hollow pin
        btn.className = 'pin-btn';
        btn.title = isPinned ? 'Unpin this chat' : 'Pin this chat';
        btn.style.marginRight = '6px';
        btn.style.cursor = 'pointer';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.color = isPinned ? 'gold' : 'gray';
        btn.style.fontSize = '14px';
  
        btn.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
  
          chrome.storage.sync.get({ pinnedChats: [] }, (data) => {
            const current = data.pinnedChats || [];
            let updated;
  
            if (isPinned) {
              updated = current.filter(c => c.url !== chatURL);
            } else {
              updated = [...current, { title: chatTitle, url: chatURL }];
            }
  
            chrome.storage.sync.set({ pinnedChats: updated }, () => {
              // Force refresh the buttons by re-running
              injectPinButtons();
            });
          });
        };
  
        titleNode.prepend(btn);
      });
    });
  }
  
  setInterval(() => {
    injectPinButtons();
    renderPinnedChats();
  }, 2000);
  
  