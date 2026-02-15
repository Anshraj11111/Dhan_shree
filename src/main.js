import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Images
const IMAGES = [
    '/images/event_1.jpg',
    '/images/event_2.jpg',
    '/images/event_3.jpg',
    '/images/event_4.jpg',
    '/images/event_5.jpg'
];

// Scene Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const container = document.getElementById('canvas-container');
if (container) {
    container.appendChild(renderer.domElement);
}

// Light Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xD4AF37, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Gallery Carousel
const carouselGroup = new THREE.Group();
carouselGroup.position.y = -50; // Start hidden
scene.add(carouselGroup);

// Add specific light for the carousel center to illuminate images
const carouselLight = new THREE.PointLight(0xffffff, 2, 20);
carouselLight.position.set(0, 0, 0);
carouselGroup.add(carouselLight);

const textureLoader = new THREE.TextureLoader();
const radius = 7;
const carouselMeshes = [];

IMAGES.forEach((imgSrc, index) => {
    textureLoader.load(imgSrc, (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(4, 2.6);
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        const angle = (index / IMAGES.length) * Math.PI * 2;
        plane.position.x = Math.cos(angle) * radius;
        plane.position.z = Math.sin(angle) * radius;

        // Make the image face the center (0,0,0)
        plane.lookAt(0, 0, 0);

        carouselGroup.add(plane);
        carouselMeshes.push(plane);
    });
});

// Mouse movement
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});

// Scroll handling
let currentScroll = 0;

window.addEventListener('scroll', () => {
    currentScroll = window.scrollY;

    // Gallery section - show carousel
    const gallerySection = document.getElementById('virtual-tour');
    if (gallerySection) {
        const rect = gallerySection.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // In view
            gsap.to(carouselGroup.position, {
                y: 0,
                duration: 1.5,
                ease: "power2.out"
            });

            // Rotate based on scroll
            const progress = (window.innerHeight - rect.top) / window.innerHeight;
            carouselGroup.rotation.y = progress * Math.PI * 2;
        } else {
            // Out of view
            gsap.to(carouselGroup.position, {
                y: -50,
                duration: 1
            });
        }
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Camera parallax
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Simple fade-in animations for hero
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.fromTo(heroContent.children,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            }
        );
    }
});


// Register ScrollTrigger
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// About Section Animations
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    // Text Content
    const content = aboutSection.querySelector('.about-content');
    if (content) {
        gsap.from(content.children, {
            scrollTrigger: {
                trigger: content,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // Visual/Image
    const visual = aboutSection.querySelector('.about-visual');
    if (visual) {
        gsap.from(visual, {
            scrollTrigger: {
                trigger: visual,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: 50,
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: "power3.out"
        });
    }
}
