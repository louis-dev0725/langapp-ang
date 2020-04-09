window.addEventListener('message', function(event) {
  if (event.source != window) {
    return;
  }

  if (event.data.type && (event.data.type == 'LoginSuccess') && (event.origin == 'http://localhost:4200')) {
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user');

    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user }});
  }

  if (event.data.type && (event.data.type == 'Logout') && (event.origin == 'http://localhost:4200')) {
    chrome.runtime.sendMessage({ type: 'siteLogout' });
  }
});

// Послыаем данные куда-то в расширение
// chrome.extension.sendMessage();

// Принимаем данные от расширения
// chrome.extension.onMessage.addListener((request, sender, respond) => {});
