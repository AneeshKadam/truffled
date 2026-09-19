document.addEventListener('DOMContentLoaded', function() {
    (function() {
    let totalElements = 0;
    let loadedElements = 0;
    const observer = new MutationObserver(() => {
        const allElements = document.querySelectorAll('*');
        totalElements = allElements.length;
    });

    observer.observe(document, { childList: true, subtree: true });

    function checkLoadedElements() {
        const allElements = document.querySelectorAll('*');
        totalElements = allElements.length;
        loadedElements = 0;

        allElements.forEach(el => {
            if (isElementLoaded(el)) loadedElements++;
        });

        const percent = totalElements > 0
            ? ((loadedElements / totalElements) * 100).toFixed(1)
            : 0;

        document.getElementById('loading-bar').style.width = `${percent}%`
        if (document.readyState !=='complete') {
            requestAnimationFrame(checkLoadedElements);
        } else {
            observer.disconnect();
            const loading = document.getElementById('loading-screen');
            loading.style.opacity = '0';
            document.getElementById('loading-bar').style.width = `100%`
              setTimeout(() => {
                loading.style.display = 'none';
              }, 1000); 
        }
    }

    function isElementLoaded(el) {
        if (el.tagName === 'IMG') return el.complete;
        if (el.tagName === 'SCRIPT') return el.readyState === 'complete' || el.readyState === 'loaded';
        if (el.tagName === 'LINK' && el.rel === 'stylesheet') return true;
        return true;
    }

    requestAnimationFrame(checkLoadedElements);
})();
});