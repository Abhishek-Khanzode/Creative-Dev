const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;

const modelContainer = document.querySelector(".model");
if (modelContainer) {
    modelContainer.appendChild(renderer.domElement);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 7.5);
mainLight.position.set(0.5, 7.5, 2.5);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
fillLight.position.set(-15, 0, -5);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

let model;
const loader = new THREE.GLTFLoader();
loader.load("./assets/macbook.glb", function (gltf) {
    model = gltf.scene;
    model.traverse((node) => {
        if (node.isMesh) {
            if (node.material) {
                node.material.metalness = 0.8;
                node.material.roughness = 0.5;
                node.material.envMapIntensity = 5;
            }
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 2;

    model.scale.set(0, 0, 0);
    model.rotation.set(0, 0.5, 0);

    playInitialAnimation();
}, undefined, function (error) {
    console.error("Error loading the model:", error);
});

const floatAmplitude = 0.2;
const floatSpeed = 0.0015;
const rotationSpeed = 0.3;
let currentScroll = 0;
const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

function playInitialAnimation() {
    if (model) {
        gsap.to(model.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            ease: "power2.out"
        });
    }
}

lenis.on("scroll", (e) => {
    currentScroll = e.scroll;
});

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.position.y = Math.sin(Date.now() * floatSpeed) * floatAmplitude;

        const scrollProgress = Math.min(currentScroll / totalScrollHeight, 1);
        const baseTilt = 0.5;
        model.rotation.x = scrollProgress * Math.PI * 4 + baseTilt;
    }

    renderer.render(scene, camera);
}
animate();

function updateModelScale() {
    if (window.innerWidth < 768) {
        model.scale.set(0.65, 0.65, 0.65);
    } else if (window.innerWidth < 1024) {
        model.scale.set(0.75, 0.75, 0.75);
    } else {
        model.scale.set(1, 1, 1);
    }
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateModelScale();
});



function customMouse() {
    const cursor = document.querySelector(".main .cursor");
    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: "power1.out"
        });
    });

    const menu = document.querySelector(".nav .menu");
    menu.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            scale: 5,
            duration: 0.3,
            zIndex: "10",
            ease: "power2.out"
        });
    });

    menu.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            scale: 1,
            duration: 0.3,
            zIndex: "1",
            ease: "power2.out"
        });
    });

    const full = document.querySelector(".full");
    full.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            duration: 0.3,
            zIndex: "10",
            ease: "power2.out"
        });
    });
    full.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            duration: 0.3,
            zIndex: "3",
            ease: "power2.out"
        });
    });

    const fullLinks = document.querySelectorAll(".full .links a");
    fullLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 5,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    const fullClose = document.querySelector(".full .close");
    fullClose.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            scale: 4,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    fullClose.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
}

customMouse();

function fullMenuAnimation() {
    var tlfull = gsap.timeline()
    var full = document.querySelector(".full")
    var menu = document.querySelector(".menu")
    var close = document.querySelector(".close")

    tlfull.to(".full", {
        top: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
    })

    tlfull.from(".full h1", {
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
    })

    tlfull.from(".full .links a", {
        y: -70,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
    })

    tlfull.from(".full i", {
        opacity: 0,
        stagger: 0.3,
        ease: "power2.out",
    })

    tlfull.pause()

    menu.addEventListener("click", function () {
        tlfull.play()
    })
    close.addEventListener("click", function () {
        tlfull.reverse()
    })
}

fullMenuAnimation();

function headerAnimation() {
    const nav = document.querySelector(".nav ");
    const navlink = document.querySelector(".nav ul a ");
    const headerTexts = document.querySelectorAll(".text1 .box h1");
    const headerPara = document.querySelector(".header p");

    var tl = gsap.timeline();

    tl.from(nav, {
        opacity: 0,
        y: -200,
        duration: 1,
    }).from(headerTexts, {
        y: 150,
        stagger: 0.4,
        duration: 1,
        ease: "power1.out"
    }).from(headerPara, {
        opacity: 0,
        duration: 1,
    });
}

headerAnimation();

function seconeAnimation() {
    const heading = document.querySelector(".sec1 h1");
    const infoText = document.querySelector("sec1 .text2")
    const splitText = new SplitType(heading, { types: "chars" });

    gsap.to(splitText.chars, {
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".sec1",
            start: "top 52%",
            end: "top 4%",
            scrub: true,
        },
    })
}
seconeAnimation();

document.addEventListener("DOMContentLoaded", () => {
    function sectwoAnimation() {
        const hoverText = document.querySelectorAll(".sec2 .text3 h2");
        const cursor = document.querySelector(".cursor");

        gsap.set(".image-container", { display: "none", opacity: 0 });

        if (hoverText.length && cursor) {
            hoverText.forEach((h2) => {
                h2.addEventListener("mouseenter", () => {
                    gsap.to(cursor, {
                        opacity: 0,
                        duration: 0.2,
                        ease: "power2.out",
                    });
                });

                h2.addEventListener("mouseleave", () => {
                    gsap.to(cursor, {
                        opacity: 1,
                        duration: 0.2,
                        ease: "power2.out",
                    });
                });
            });
        }

        const headings = document.querySelectorAll(".sec2 .text3 h2");

        if (headings.length) {
            headings.forEach((heading) => {
                const imageId = heading.getAttribute("data-image");
                const imageContainer = document.getElementById(imageId);

                if (imageContainer) {
                    heading.addEventListener("mouseenter", () => {
                        gsap.set(imageContainer, { display: "block" });
                        gsap.fromTo(
                            imageContainer,
                            { opacity: 0, x: -20 },
                            { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
                        );
                    });

                    heading.addEventListener("mouseleave", () => {
                        gsap.to(imageContainer, {
                            opacity: 0,
                            x: -20,
                            duration: 0.3,
                            ease: "power2.in",
                            onComplete: () => gsap.set(imageContainer, { display: "none" }),
                        });
                    });
                }
            });
        }
    }

    sectwoAnimation();
});
