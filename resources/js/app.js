import '../css/app.css'

window.addEventListener('click', function(e) {
    if (e.target.id === 'mobile-open') {
        document.getElementById('mobile-menu').classList.remove('hidden');
        document.getElementById('mobile-menu').classList.add('block');
        document.getElementById('mobile-open').classList.remove('block');
        document.getElementById('mobile-open').classList.add('hidden');
        document.getElementById('mobile-close').classList.remove('hidden');
        document.getElementById('mobile-close').classList.add('block');
    } else if (e.target.id === 'mobile-close') {
        document.getElementById('mobile-menu').classList.remove('block');
        document.getElementById('mobile-menu').classList.add('hidden');
        document.getElementById('mobile-open').classList.remove('hidden');
        document.getElementById('mobile-open').classList.add('block');
        document.getElementById('mobile-close').classList.remove('block');
        document.getElementById('mobile-close').classList.add('hidden');
    }
})