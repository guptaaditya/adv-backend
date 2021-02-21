(function(){
    var query = new URLSearchParams(window.location.search);
    let referredBy = query.get('referral') || '';
    try {
        if (referredBy) {
            document.querySelectorAll('[href="./signup"]').forEach(elem => {
            elem.href = `./signup?referral=${referredBy}`;
            });
        }
    } catch (e) {
        referredBy = '';
    }
})();