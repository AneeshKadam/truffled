document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.display = 'block';
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
});