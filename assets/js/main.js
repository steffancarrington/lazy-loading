// Most Performant Way of Lazy Loading Images (No Edge, IE or Mobile iOS Suuport)
// IntersectionObserver Polyfill can be found at - https://github.com/w3c/IntersectionObserver/tree/master/polyfill
// Full Implementation with BG Images & Video - https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/

document.addEventListener('DOMContentLoaded', function() {

    // [] creates a new array
    // .slice() - Selects element in an array, as a new array object
    // .call() - Calls a function belonging to one object to assigned and called for a different object
    var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

    // 'IntersectionObserver' - an API to asynchronously observe changes in the viewport
    if('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            // .forEach - executes a provided function once for each array element
            entries.forEach(function(entry) {
                // .isIntersecting - boolean value which indicates whether the target has transitioned in a state of intersection
                if(entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.srcset = lazyImage.dataset.srcset;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });  
        });

        lazyImages.forEach(function(lazyImage) {
            // .observe() - used to asynchronously observe the changes to an object.
            lazyImageObserver.observe(lazyImage);
        });


    } else {
        // CLess Performant Cross Browser Solution
        console.log('Lazy loading of Images not surpported, sorry!');

        // Active variable to contain processing state for throttling function calls
        let active = false;

        const lazyLoad = function() {
            if(active === false) {
                active: true;
    
                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        // .getBoundingClientRect() - is a method that returns the size of an element and the position relative to the viewport
                        // Checks whether images are in the viewport...
                        if((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.srcset = lazyImage.dataset.srcset;
                            lazyImage.classList.remove('lazy');
    
                            // .filter() - method that creates a new array with all elements that pass the test implemented by the provided function
                            lazyImages = lazyImages.filter(function(image) {
                                return image !== lazyImage;
                            });
    
                            if (lazyImages.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });
    
                    active = false;
                }, 200);
            }
        };
    
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }
});
