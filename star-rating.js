function StarRating( starRatingRootElement ) {
    this.starRatingRootElement = starRatingRootElement;

    Object.defineProperty(this, 'currentRating', {
        get: function () {
            return this._currentRating;
        },

        set: function (value) {
            if (typeof value === 'number' || value === null) {
                this._currentRating = value;
                this.starRatingRootElement.setAttribute('data-current-rating', value);
            }
            else {
                throw new TypeError('value must be a number');
            }
        } 
    });

    var currentRating = +starRatingRootElement.getAttribute('data-current-rating');

    if (currentRating) {
        this.currentRating = currentRating;
    } 
    else {
        this.currentRating = null;
    }
    
    

    this.stars = starRatingRootElement.querySelectorAll('span');
    
    for (var i = 0; i < this.stars.length; i++) {
        this.stars[i].setAttribute('data-index', i);
        this.stars[i].addEventListener('mouseenter', this.fillStarsToElement.bind(this) , false);

        var self = this;

        this.stars[i].addEventListener('click', function (e) {
            self.currentRating = parseInt(e.target.getAttribute('data-index')) + 1; 
            self.fillStarsToElement();
        } , false);
    }

    this.fillStarsToElement();
}

StarRating.prototype.fillStarsToElement = function (e) {
    var elem = e ? e.target : null;

    var elementIndex;

    if (elem) {
        elementIndex = +elem.getAttribute('data-index');
        this.currentRating = elementIndex + 1; 
    }
    else { 
        elementIndex = this.currentRating - 1;
    }

    for (var i = 0; i < this.stars.length; i++) {

        if (parseInt(this.stars[i].getAttribute('data-index')) > elementIndex) {
            this.stars[i].classList.remove('hover');
        }
        else {
            this.stars[i].classList.add('hover');
        }
    }
}