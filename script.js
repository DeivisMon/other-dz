const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.registerPlugin(Flip, CustomEase, ScrollToPlugin);

CustomEase.create(
    "custom",
    "M0,0 C0.5,0 0.5,1 1,1"
)

const items = document.querySelectorAll("nav .nav-item p");
const gallery = document.querySelector(".gallery");
const galleryContainer = document.querySelector(".gallery-container");
const imgPreviews = document.querySelector(".img-previews");
const minimap = document.querySelector(".minimap");

let activeLayout = "gallery-1";

function changeLayout(newLayout) {
    if (newLayout === activeLayout) 
        return;
    
    if(activeLayout === "gallery-2" && window.scrollY > 0) {
        gsap.to(window, {
            scrollTo: {
                y: 0
            },
            duration: 1,
            ease: "power3.out",
            onComplete: () => 
                changeLayoutHandler(newLayout)
        })
    } else {
        changeLayoutHandler(newLayout);
    }
}

function changeLayoutHandler(newLayout) {
    const state = Flip.getState(gallery.querySelectorAll(".img"));
    gallery.classList.remove(activeLayout);
    gallery.classList.add(newLayout);
    
    let staggerValue = 0.025;
    if((activeLayout === "gallery-1" && newLayout === "gallery-2") || (activeLayout === "gallery-3" && newLayout === "gallery-2")) {
        staggerValue = 0;
    }

    Flip.from(state, {
        duration: 1,
        ease: "custom",
        stagger: {
            each: staggerValue
        }
    });
    
    activeLayout = newLayout;

    if(newLayout === "gallery-2") {
        gsap.to([imgPreviews, minimap],
            {
                autoAlpha: 1,
                duration: 0.3,
                delay: 0.5,
            })
            window.addEventListener("scroll", handleScroll);
    } else {
        gsap.to([imgPreviews, minimap],
            {
                autoAlpha: 0,
                duration: 0.3,
            })
            window.removeEventListener("scroll", handleScroll);
            gsap.set(gallery, {clearProps: "y"});
            gsap.set(minimap, {clearProps: "y"});
    }

    items.forEach(item => {
        item.classList.toggle("active", item.id === newLayout);
    })
}

items.forEach(item => {
    item.addEventListener("click", () => {
        if(!item.id) return;
        changeLayout(item.id);
    })
})

function handleScroll() {
    if(activeLayout !== "gallery-2") return;

    const imgPreviewHeight = imgPreviews.scrollHeight;
    const galleryHeight = gallery.scrollHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const scrollFraction = scrollY / (imgPreviewHeight - windowHeight) * 1.525;
    const galleryTranslate = -scrollFraction * (galleryHeight - windowHeight);
    const minimapTranslate = scrollFraction * (windowHeight - minimap.offsetHeight) * 0.425;

    gsap.set(gallery, {y: galleryTranslate});
    gsap.set(minimap, {y: minimapTranslate});
}

window.addEventListener("load", () => {
    if(activeLayout === "gallery-2") {
        handleScroll();
    }
})