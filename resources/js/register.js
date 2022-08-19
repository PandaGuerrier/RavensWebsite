// {{ route('/api/v1/users/register') }}
import axios from 'axios'

window.addEventListener('click', function (e) {
    if (e.target.id === 'register-button') {
        
        document.getElementById('mobile-menu').classList.remove('hidden');
        document.getElementById('mobile-menu').classList.add('block');
        document.getElementById('mobile-open').classList.remove('block');
        document.getElementById('mobile-open').classList.add('hidden');
        document.getElementById('mobile-close').classList.remove('hidden');
        document.getElementById('mobile-close').classList.add('block');
    }
})