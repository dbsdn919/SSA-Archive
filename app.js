/**
 * Site Specific Arts — 3D Globe & Interactions
 * Three.js r128
 */

(function () {
  'use strict';

  // ===============================
  // Config & State
  // ===============================
  const CONFIG = {
    globe: {
      radius: 1.6, // Slightly larger
      smallDotCount: 5000,
      smallDotSize: 0.035,
      shellThickness: 0.2,
      artworkDotSize: 0.035,
      rotationDamping: 0.96, // Lower friction for longer glide
      autoRotateSpeed: 0.0015,
    },
    camera: {
      fov: 45,
      near: 0.1,
      far: 100,
      z: 5.5,
    },
    animation: {
      convergeDuration: 1200,
      expandDuration: 800,
      introDelay: 500,
      introDuration: 2000, // Extended for elegant deceleration
      uiDelay: 700,
      dotFadeDuration: 800
    },
  };

  // Fallback to ensure app-ready is triggered if the intro animation stalls
  const readyFallback = setTimeout(() => {
    document.body.classList.add('app-ready');
  }, 3000);

  let currentLang = 'ko';
  let isArtworkDetailOpen = false;
  let selectedArtworkIndex = -1;
  let isConverging = false;
  let isFindMode = false;
  let morphProgress = 0;

  // ===============================
  // Artwork Data
  // ===============================
  const artworks = [
    {
      title: { ko: '물의 기억', en: 'Memory of Water' },
      artist: { ko: '박수진', en: 'Sujin Park' },
      description: {
        ko: '한강 변에 설치된 이 작품은 물의 흐름과 시간의 관계를 탐구합니다.',
        en: 'Installed along the Han River, this work explores the relationship between water flow and time.',
      },
      location: { ko: '한강 잠원지구', en: 'Jamwon, Han River' },
      phi: 2.1,
      theta: 4.2,
    },
    {
      title: { ko: '콘크리트 숲', en: 'Concrete Forest' },
      artist: { ko: '이도현', en: 'Dohyun Lee' },
      description: {
        ko: '도심 한가운데 버려진 건물에서 자연과 인공의 경계를 허무는 설치 작품.',
        en: 'An installation in an abandoned urban building that blurs the boundary between nature and artifice.',
      },
      location: { ko: '을지로 폐건물', en: 'Euljiro, Abandoned Building' },
      phi: 2.2,
      theta: 1.1,
    },
    {
      title: { ko: '빛의 통로', en: 'Corridor of Light' },
      artist: { ko: '김민지', en: 'Minji Kim' },
      description: {
        ko: '지하 통로에 빛을 끌어들여 새로운 공간 경험을 만들어내는 작품.',
        en: 'A work that draws light into underground passages, creating a new spatial experience.',
      },
      location: { ko: '광화문 지하보도', en: 'Gwanghwamun Underground' },
      phi: 1.2,
      theta: 2.5,
    },
    {
      title: { ko: '바람의 조각', en: 'Sculpture of Wind' },
      artist: { ko: '최우석', en: 'Wooseok Choi' },
      description: {
        ko: '산 정상에 설치되어 바람의 방향과 세기를 시각화하는 키네틱 조각.',
        en: 'A kinetic sculpture on a mountaintop that visualizes the direction and strength of wind.',
      },
      location: { ko: '북한산 백운대', en: 'Baegundae, Bukhansan' },
      phi: 1.4,
      theta: 5.2,
    },
    {
      title: { ko: '사라지는 풍경', en: 'Fading Landscape' },
      artist: { ko: '강민성', en: 'Minseong Kang' },
      description: {
        ko: '철거를 앞둔 주택가 골목길에 남겨진 일상의 흔적들을 채집한 기록.',
        en: 'A collection of everyday traces left in a residential alley slated for demolition.',
      },
      location: { ko: '아현동 재개발 구역', en: 'Ahyeon-dong Redevelopment Area' },
      phi: 1.8,
      theta: 0.5,
    },
    {
      title: { ko: '보이지 않는 선', en: 'Invisible Lines' },
      artist: { ko: '오지은', en: 'Jieun Oh' },
      description: {
        ko: '도심의 통신탑 사이를 가로지르는 보이지 않는 전파를 시각적 패턴으로 변환.',
        en: 'Converts invisible radio waves crossing between city communication towers into visual patterns.',
      },
      location: { ko: '남산 타워 부근', en: 'Near Namsan Tower' },
      phi: 1.1,
      theta: 3.8,
    },
    {
      title: { ko: '소리의 거울', en: 'Mirror of Sound' },
      artist: { ko: '정하늘', en: 'Haneul Jung' },
      description: {
        ko: '광장에 울려 퍼지는 군중의 소리를 실시간으로 반사하여 공명하게 하는 장치.',
        en: 'A device that reflects and resonates the sounds of the crowd echoing in the plaza in real-time.',
      },
      location: { ko: '서울광장', en: 'Seoul Plaza' },
      phi: 2.5,
      theta: 5.8,
    },
    {
      title: { ko: '기억의 지층', en: 'Strata of Memory' },
      artist: { ko: '임소현', en: 'Sohyun Lim' },
      description: {
        ko: '오래된 성곽 밑에 묻혀있던 흙과 돌을 쌓아 올려 시간의 단면을 보여주는 작업.',
        en: 'A work displaying a cross-section of time by piling soil and stones buried under the old fortress.',
      },
      location: { ko: '한양도성 성곽길', en: 'Hanyangdoseong Wall Path' },
      phi: 0.8,
      theta: 1.9,
    },
    {
      title: { ko: '부유하는 정원', en: 'Floating Garden' },
      artist: { ko: '한재석', en: 'Jaeseok Han' },
      description: {
        ko: '고가도로 아래 그늘진 공간에서 식물이 자랄 수 있도록 고안된 인공 생태계.',
        en: 'An artificial ecosystem designed to allow plants to grow in the shaded space under an overpass.',
      },
      location: { ko: '서울로 7017 하부', en: 'Under Seoullo 7017' },
      phi: 2.7,
      theta: 3.1,
    },
    {
      title: { ko: '그림자 춤', en: 'Shadow Dance' },
      artist: { ko: '송다영', en: 'Dayoung Song' },
      description: {
        ko: '해가 질 무렵 건물의 틈새로 새어 들어오는 빛이 만들어내는 기하학적 형태.',
        en: 'Geometric shapes created by light seeping through the gaps of buildings at sunset.',
      },
      location: { ko: '종로 피맛골', en: 'Pimatgol, Jongno' },
      phi: 1.6,
      theta: 0.9,
    },
  ];

  // ===============================
  // Three.js Setup
  // ===============================
  const appContainer = document.querySelector('.app-container');
  const canvas = document.getElementById('globe-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    appContainer.clientWidth / appContainer.clientHeight,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  camera.position.z = CONFIG.camera.z;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(appContainer.clientWidth, appContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ===============================
  // Globe Group
  // ===============================
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const smallDotsMeshes = [];
  const artworkMeshes = [];
  const labelElements = [];
  const labelsContainer = document.getElementById('labels-container');

  // Fix horizontal FOV so globe always looks the same width relative to screen
  const TARGET_HFOV = 42; // degrees - fixed horizontal field of view

  function updateViewport() {
    // Force container height to match actual window height to avoid mobile 100vh bug
    appContainer.style.height = `${window.innerHeight}px`;

    const rect = appContainer.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const aspect = w / h;
    
    // Convert fixed horizontal FOV to vertical FOV based on current aspect ratio
    const hFovRad = TARGET_HFOV * Math.PI / 180;
    const vFovRad = 2 * Math.atan(Math.tan(hFovRad / 2) / aspect);
    camera.fov = vFovRad * 180 / Math.PI;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

    // Calculate a scale factor based on container width (relative to 480px base)
    const baseWidth = 480;
    const appScale = w / baseWidth;
    appContainer.style.setProperty('--app-scale', appScale);

    // Proportionally scale dots so they always match the font size and globe size
    const dotBaseSize = 8;
    const dotPixelSize = dotBaseSize * appScale;
    const vFovRad_val = camera.fov * Math.PI / 180;
    const visibleHeight_val = 2 * Math.tan(vFovRad_val / 2) * CONFIG.camera.z;
    const dotWorldScale = (dotPixelSize / h) * visibleHeight_val;
    artworkMeshes.forEach(dot => {
      dot.scale.set(dotWorldScale, dotWorldScale, 1);
    });

    // Globe scale stays 1.0 — no scaling needed since camera handles it
    globeGroup.scale.set(1, 1, 1);

    // Position globe between header and bottom text
    const headerHeight = 60;
    const bottomHeight = 220;
    const offsetPx = (bottomHeight - headerHeight) / 2;
    const vFovRad2 = camera.fov * Math.PI / 180;
    const visibleHeight = 2 * Math.tan(vFovRad2 / 2) * CONFIG.camera.z;
    const offsetWorld = (offsetPx / h) * visibleHeight;
    globeGroup.position.y = offsetWorld;
  }
  updateViewport();

  // --- Small dots (sphere shell) ---
  // smallDotsMeshes already declared at top
  const sizes = [0.01, 0.016, 0.023];
  const opacities = [0.4, 0.7, 0.9];
  const proportions = [0.6, 0.3, 0.1]; // Distribution of sizes

  // Custom vertex/fragment shaders for Fresnel edge-fading
  const particleVertexShader = `
    attribute vec3 aTargetPosition;
    uniform float uMorph;
    uniform float uPointSize;
    uniform float uTime;
    varying float vFresnel;

    void main() {
      // 1. Morph between sphere and center
      vec3 pos = mix(position, vec3(0.0), uMorph);
      
      // 2. Add organic noise (GPU side for performance)
      if (uMorph < 0.99) {
        float phase = fract(sin(dot(position.xyz, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
        pos.x += sin(uTime * 1.2 + phase * 6.28) * 0.02 * (1.0 - uMorph);
        pos.y += cos(uTime * 1.4 + phase * 6.28) * 0.02 * (1.0 - uMorph);
        pos.z += sin(uTime * 1.0 + phase * 6.28) * 0.02 * (1.0 - uMorph);
      }

      vec3 normal = normalize(position);
      vec3 worldNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vec3 viewDir = normalize(-mvPosition.xyz);
      vFresnel = dot(viewDir, worldNormal);
      
      gl_PointSize = uPointSize * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  const particleFragmentShader = `
    uniform float uBaseOpacity;
    uniform vec3 uColor;
    uniform float uMorph;
    varying float vFresnel;
    void main() {
      float facing = clamp((vFresnel + 1.0) * 0.5, 0.0, 1.0);
      float fadeCurve = pow(facing, 0.7);
      
      float morphFade = 1.0 - uMorph;
      float alpha = uBaseOpacity * mix(0.15, 1.0, fadeCurve) * morphFade;
      
      vec3 color = mix(vec3(0.5), uColor, fadeCurve);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  sizes.forEach((size, index) => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const originals = [];
    const targetPositions = [];
    const count = CONFIG.globe.smallDotCount * proportions[index];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = CONFIG.globe.radius;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions.push(x, y, z);
      originals.push(x, y, z);
      
      // Target: All points collapse to the center (0,0,0)
      targetPositions.push(0, 0, 0);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aTargetPosition', new THREE.Float32BufferAttribute(targetPositions, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPointSize: { value: size * 800 },
        uBaseOpacity: { value: opacities[index] },
        uColor: { value: new THREE.Color(0x000000) },
        uMorph: { value: 0.0 },
        uTime: { value: 0.0 },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.userData = { originals, baseOpacity: opacities[index] };
    globeGroup.add(points);
    smallDotsMeshes.push(points);
  });

  // Invisible hit sphere for precise drag detection
  const hitGeometry = new THREE.SphereGeometry(CONFIG.globe.radius, 32, 32);
  const hitMaterial = new THREE.MeshBasicMaterial({ 
    transparent: true, 
    opacity: 0, 
    depthWrite: false 
  });
  const hitSphere = new THREE.Mesh(hitGeometry, hitMaterial);
  globeGroup.add(hitSphere);

  // --- Artwork dots (larger) ---
  const artworkGroup = new THREE.Group();
  globeGroup.add(artworkGroup);

  // Create a circle texture for artwork dot sprites
  const dotCanvas = document.createElement('canvas');
  dotCanvas.width = 64;
  dotCanvas.height = 64;
  const dotCtx = dotCanvas.getContext('2d');
  dotCtx.beginPath();
  dotCtx.arc(32, 32, 30, 0, Math.PI * 2);
  dotCtx.fillStyle = '#000000';
  dotCtx.fill();
  const dotTexture = new THREE.CanvasTexture(dotCanvas);

  artworks.forEach((artwork, index) => {
    const r = CONFIG.globe.radius + 0.03;
    const x = r * Math.sin(artwork.phi) * Math.cos(artwork.theta);
    const y = r * Math.cos(artwork.phi);
    const z = r * Math.sin(artwork.phi) * Math.sin(artwork.theta);
    const pos = new THREE.Vector3(x, y, z);

    // Sprite dot (always faces camera = always a perfect circle)
    const dotMaterial = new THREE.SpriteMaterial({
      map: dotTexture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    const dot = new THREE.Sprite(dotMaterial);
    const dotScale = CONFIG.globe.artworkDotSize * 3;
    dot.scale.set(dotScale, dotScale, 1);
    dot.position.copy(pos);
    const randomDelay = Math.random() * 1200; // Random delay up to 1.2s for staggering
    dot.userData = { 
      artworkIndex: index, 
      originalPos: pos.clone(), 
      introDelay: randomDelay,
      originalLocalPos: pos.clone() // Store for collapse
    };

    artworkGroup.add(dot);
    artworkMeshes.push(dot);

    // Create DOM label
    const label = document.createElement('div');
    label.className = 'artwork-label';
    label.textContent = artwork.artist[currentLang];
    
    label.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isArtworkDetailOpen && !isConverging) {
        openArtworkDetail(index);
      }
    });
    
    label.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      if (!isArtworkDetailOpen && !isConverging) {
        openArtworkDetail(index);
      }
    }, { passive: true });
    
    labelsContainer.appendChild(label);
    labelElements.push({ element: label });
  });

  // ===============================
  // Raycasting (artwork click)
  // ===============================
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points = { threshold: 0.1 };
  const mouse = new THREE.Vector2();

  function onArtworkClick(event) {
    if (isConverging) return;

    const rect = canvas.getBoundingClientRect();
    const pos = getEventPos(event);

    mouse.x = ((pos.x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((pos.y - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworkMeshes);

    if (intersects.length > 0) {
      const artworkIndex = intersects[0].object.userData.artworkIndex;
      openArtworkDetail(artworkIndex);
    } else {
      if (isArtworkDetailOpen) {
        closeArtworkDetail();
      }
    }
  }

  // ===============================
  // Converge / Expand Animation
  // ===============================
  function openArtworkDetail(index) {
    selectedArtworkIndex = index;
    rotationVelocity = { x: 0, y: 0 };
    lastInteractionTime = performance.now();

    const dot = artworkMeshes[index];
    const dotLocalPos = dot.position.clone().normalize();
    const dotWorldDir = dotLocalPos.clone().applyQuaternion(globeGroup.quaternion).normalize();
    
    const globeCenter = new THREE.Vector3();
    globeGroup.getWorldPosition(globeCenter);
    const targetDir = camera.position.clone().sub(globeCenter).normalize();
    
    const rotationQuat = new THREE.Quaternion().setFromUnitVectors(dotWorldDir, targetDir);
    const startQuat = globeGroup.quaternion.clone();
    const targetQuat = rotationQuat.multiply(startQuat);

    const rotateStartTime = performance.now();
    const rotateDuration = 1000; // Balanced at 1 second

    isArtworkDetailOpen = true;
    showArtworkInIntro(index);

    function animateRotateToCenter(now) {
      const elapsed = now - rotateStartTime;
      const t = Math.min(elapsed / rotateDuration, 1);
      
      // Power-4 Ease-Out: Smoother start than Expo-Out, very delicate end
      const ease = 1 - Math.pow(1 - t, 4);

      globeGroup.quaternion.copy(startQuat).slerp(targetQuat, ease);

      if (t < 1) {
        requestAnimationFrame(animateRotateToCenter);
      }
    }

    requestAnimationFrame(animateRotateToCenter);
  }

  const originalIntroTitle = document.querySelector('.intro-section__title').textContent;
  const originalIntroText = document.querySelector('.intro-section__text').textContent;
  const originalIntroTitleKo = document.querySelector('.intro-section__title').getAttribute('data-ko');
  const originalIntroTitleEn = document.querySelector('.intro-section__title').getAttribute('data-en');
  const originalIntroTextKo = document.querySelector('.intro-section__text').getAttribute('data-ko');
  const originalIntroTextEn = document.querySelector('.intro-section__text').getAttribute('data-en');

  function showArtworkInIntro(index, skipAnimation = false) {
    const artwork = artworks[index];
    const titleEl = document.getElementById('introTitle');
    const mainTitleEl = document.getElementById('introMainTitle');
    const textEl = document.getElementById('introText');
    const actionsEl = document.getElementById('introActions');
    const hintEl = document.getElementById('globeHint');

    const newTitle = artwork.artist[currentLang] + ' · 2026';
    const newMainTitle = artwork.title[currentLang];
    const newText = artwork.description[currentLang];
    const newHint = currentLang === 'ko' ? '찾기를 눌러 위치로' : 'TAP FIND TO LOCATION';

    if (skipAnimation) {
      titleEl.textContent = newTitle;
      mainTitleEl.textContent = newMainTitle;
      textEl.textContent = newText;
      hintEl.textContent = newHint;
      mainTitleEl.style.display = 'block';
      actionsEl.style.display = 'flex';
      titleEl.style.opacity = '1';
      mainTitleEl.style.opacity = '1';
      textEl.style.opacity = '1';
      actionsEl.style.opacity = '1';
      return;
    }

    titleEl.style.opacity = '0';
    if (mainTitleEl.style.display === 'block') mainTitleEl.style.opacity = '0';
    textEl.style.opacity = '0';
    if (actionsEl.style.display === 'flex') actionsEl.style.opacity = '0';

    setTimeout(() => {
      titleEl.textContent = newTitle;
      mainTitleEl.textContent = newMainTitle;
      textEl.textContent = newText;
      hintEl.textContent = newHint;

      mainTitleEl.style.display = 'block';
      actionsEl.style.display = 'flex';

      requestAnimationFrame(() => {
        titleEl.style.opacity = '1';
        mainTitleEl.style.opacity = '1';
        textEl.style.opacity = '1';
        actionsEl.style.opacity = '1';
      });
    }, 200);
  }

  function closeArtworkDetail() {
    isArtworkDetailOpen = false;
    selectedArtworkIndex = -1;
    lastInteractionTime = performance.now();

    const titleEl = document.getElementById('introTitle');
    const mainTitleEl = document.getElementById('introMainTitle');
    const textEl = document.getElementById('introText');
    const actionsEl = document.getElementById('introActions');
    const hintEl = document.getElementById('globeHint');

    titleEl.style.opacity = '0';
    mainTitleEl.style.opacity = '0';
    textEl.style.opacity = '0';
    actionsEl.style.opacity = '0';

    setTimeout(() => {
      titleEl.textContent = currentLang === 'ko' ? originalIntroTitleKo : originalIntroTitleEn;
      textEl.textContent = currentLang === 'ko' ? originalIntroTextKo : originalIntroTextEn;
      hintEl.textContent = currentLang === 'ko' ? '구를 돌리고 점을 눌러보세요' : 'DRAG SPHERE · TAP A DOT';

      mainTitleEl.style.display = 'none';
      actionsEl.style.display = 'none';

      requestAnimationFrame(() => {
        titleEl.style.opacity = '1';
        textEl.style.opacity = '1';
      });
    }, 200);
  }

  document.getElementById('btnClose').addEventListener('click', (e) => {
    e.stopPropagation();
    closeArtworkDetail();
  });

  let isDragging = false;
  let previousPosition = { x: 0, y: 0 };
  let rotationVelocity = { x: 0, y: 0 };
  let dragStartTime = 0;
  let dragMoved = false;
  let lastInteractionTime = 0;
  const AUTO_ROTATE_PAUSE = 3000;
  const AUTO_ROTATE_FADE_IN = 1000;
  const appStartTime = performance.now();

  function getEventPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function onPointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const pos = getEventPos(e);
    mouse.x = ((pos.x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((pos.y - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObject(hitSphere);
    if (intersects.length === 0) return; 
    
    isDragging = true;
    dragMoved = false;
    dragStartTime = performance.now();
    previousPosition = pos;
    rotationVelocity = { x: 0, y: 0 };
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const pos = getEventPos(e);
    const deltaX = pos.x - previousPosition.x;
    const deltaY = pos.y - previousPosition.y;

    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      dragMoved = true;
      if (isArtworkDetailOpen) {
        closeArtworkDetail();
      }
    }

    const sensitivity = 0.005;
    // Blend new velocity with old for smoother momentum capture
    rotationVelocity.x = rotationVelocity.x * 0.5 + (deltaY * sensitivity) * 0.5;
    rotationVelocity.y = rotationVelocity.y * 0.5 + (deltaX * sensitivity) * 0.5;

    globeGroup.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), deltaY * sensitivity);
    globeGroup.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * sensitivity);

    previousPosition = pos;
  }

  function onPointerUp(e) {
    isDragging = false;
    if (dragStartTime === 0) return;
    
    lastInteractionTime = performance.now();
    const elapsed = performance.now() - dragStartTime;

    if (!dragMoved && elapsed < 300) {
      onArtworkClick(e);
    }
    
    dragStartTime = 0;
  }

  canvas.addEventListener('mousedown', onPointerDown);
  canvas.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  canvas.addEventListener('mouseleave', () => { isDragging = false; });

  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  canvas.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  const langToggle = document.getElementById('langToggle');
  langToggle.addEventListener('click', () => {
    const nextLang = currentLang === 'ko' ? 'en' : 'ko';

    document.querySelectorAll('.lang-option').forEach((el) => {
      el.classList.toggle('active', el.dataset.lang === nextLang);
    });
    const slider = document.querySelector('.lang-slider');
    if (slider) {
      slider.style.transform = nextLang === 'en' ? 'translateX(26px)' : 'translateX(0)';
    }

    document.body.classList.add('lang-transitioning');

    setTimeout(() => {
      currentLang = nextLang;

      document.querySelectorAll('[data-ko]').forEach((el) => {
        if (el.classList.contains('logo') || (el.id === 'globeHint' && isArtworkDetailOpen)) return;

        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
          } else {
            el.innerHTML = text.replace(/&#10;/g, '<br>');
          }
        }
      });

      document.querySelectorAll('.logo span').forEach(span => {
        span.classList.toggle('active', span.dataset.lang === currentLang);
      });

      document.documentElement.lang = currentLang === 'ko' ? 'ko' : 'en';

      labelElements.forEach((labelObj, i) => {
        labelObj.element.textContent = artworks[i].artist[currentLang];
      });

      if (isArtworkDetailOpen && selectedArtworkIndex >= 0) {
        showArtworkInIntro(selectedArtworkIndex, true);
      }

      document.body.classList.remove('lang-transitioning');
    }, 400);
  });

  const btnFind = document.getElementById('btnFind');
  const btnExitFind = document.getElementById('btnExitFind');
  const findDistanceVal = document.getElementById('findDistanceVal');
  const targetDot = document.getElementById('targetDot');
  const findInfoArtist = document.getElementById('findInfoArtist');
  const findInfoTitle = document.getElementById('findInfoTitle');
  const findInfoLocation = document.getElementById('findInfoLocation');

  function toggleFindMode(active) {
    isFindMode = active;
    
    if (active && selectedArtworkIndex >= 0) {
      const art = artworks[selectedArtworkIndex];
      findInfoArtist.textContent = art.artist[currentLang] + ' · 2026';
      findInfoTitle.textContent = art.title[currentLang];
      findInfoLocation.textContent = art.location[currentLang];
    }

    const target = active ? 1 : 0;
    const start = morphProgress;
    const duration = 350; // Ultra-fast
    const startTime = performance.now();

    function animateMorph(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // Apple-style Exponential easing
      // Collapse: Expo In (Accelerate into center)
      // Expand: Expo Out (Burst out from center)
      const ease = active 
        ? (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))) 
        : (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
      
      morphProgress = start + (target - start) * ease;
      
      smallDotsMeshes.forEach(mesh => {
        mesh.material.uniforms.uMorph.value = morphProgress;
      });

      // Show UI at 95% collapse, hide UI at 5% expansion
      if (active && t > 0.95 && !document.body.classList.contains('find-mode')) {
        document.body.classList.add('find-mode');
      } else if (!active && t > 0.05 && document.body.classList.contains('find-mode')) {
        document.body.classList.remove('find-mode');
      }

      if (t < 1) requestAnimationFrame(animateMorph);
    }
    requestAnimationFrame(animateMorph);

    if (active) {
      resetRadarUI(); // Reset instantly to 0 before the overlay appears
      setTimeout(startRadarSimulation, 750);
    }
  }

  btnFind.addEventListener('click', () => toggleFindMode(true));
  btnExitFind.addEventListener('click', () => toggleFindMode(false));

  let radarInterval;
  
  // New helper to reset visuals instantly
  function resetRadarUI() {
    if (radarInterval) clearInterval(radarInterval);
    const targetDist = selectedArtworkIndex >= 0 ? (100 + (selectedArtworkIndex * 47) % 300) : 139;
    const numDigits = targetDist >= 100 ? 3 : 2;
    const slots = findDistanceVal.querySelectorAll('.digit-slot');
    const columns = findDistanceVal.querySelectorAll('.digit-column');

    slots.forEach((slot, i) => {
      if (i < (3 - numDigits)) {
        slot.style.display = 'none';
      } else {
        slot.style.display = 'block';
        slot.style.opacity = '1';
        columns[i].style.transition = 'none';
        columns[i].style.transform = 'translateY(0)';
        void columns[i].offsetHeight;
        columns[i].style.transition = 'transform 0.1s ease-out';
      }
    });
    return targetDist;
  }

  function startRadarSimulation() {
    const targetDist = resetRadarUI(); // Reset again just in case, and get target
    let currentDist = 0;   
    let angle = 0;
    const numDigits = targetDist >= 100 ? 3 : 2;
    const columns = findDistanceVal.querySelectorAll('.digit-column');

    radarInterval = setInterval(() => {
      if (!isFindMode) {
        clearInterval(radarInterval);
        return;
      }
      
      // Fast count-up at start
      if (currentDist < targetDist) {
        const step = Math.ceil((targetDist - currentDist) * 0.15) + 1;
        currentDist += step;
        if (currentDist > targetDist) currentDist = targetDist;
      } else {
        // Slow jitter once reached
        currentDist = Math.max(1, currentDist - 0.1 + (Math.random() - 0.5) * 0.1);
      }
      
      angle += 2;
      
      const distInt = Math.floor(currentDist);
      const distStr = distInt.toString().padStart(numDigits, '0');
      
      // Map distStr to the visible slots
      const strChars = distStr.split('');
      const slotOffset = 3 - numDigits;
      
      strChars.forEach((char, i) => {
        const columnIndex = i + slotOffset;
        const digit = parseInt(char);
        const isMobile = window.innerWidth < 480;
        const h = isMobile ? (window.innerWidth * 0.18) : 84;
        columns[columnIndex].style.transform = `translateY(${-digit * h}px)`;
      });
      
      const ring = targetDot.parentElement;
      ring.style.transform = `rotate(${angle}deg)`;
    }, 60); 
  }

  // Pre-allocate vectors to reuse in animate loop (Prevents GC)
  const _v1 = new THREE.Vector3();
  const _v2 = new THREE.Vector3();
  const _v3 = new THREE.Vector3();

  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const time = now * 0.001;
    const elapsed = now - appStartTime;

    const anim = CONFIG.animation;
    
    let introProgress = 0;
    if (elapsed > anim.introDelay) {
      introProgress = Math.min(1, (elapsed - anim.introDelay) / anim.introDuration);
    }
    // Apple-style Exponential Out: Extremely fast burst, then infinitely smooth settle
    const spreadEase = introProgress === 1 ? 1 : 1 - Math.pow(2, -10 * introProgress);
    
    // UI Ready and Dot Fade Timings
    if (elapsed > anim.uiDelay && !document.body.classList.contains('app-ready')) {
      document.body.classList.add('app-ready');
    }
    // Start showing dots when the globe is about 85% spread out for a layered feel
    const dotFadeStartBase = anim.introDelay + (anim.introDuration * 0.4);

    // 1. Globe Rotation
    if (!isDragging && !isArtworkDetailOpen && !isConverging) {
      const timeSinceInteraction = now - lastInteractionTime;
      if (timeSinceInteraction > AUTO_ROTATE_PAUSE) {
        const fadeProgress = Math.min(1, (timeSinceInteraction - AUTO_ROTATE_PAUSE) / AUTO_ROTATE_FADE_IN);
        globeGroup.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), CONFIG.globe.autoRotateSpeed * fadeProgress);
      }
    }

    if (!isDragging) {
      rotationVelocity.x *= CONFIG.globe.rotationDamping;
      rotationVelocity.y *= CONFIG.globe.rotationDamping;
      globeGroup.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rotationVelocity.x);
      globeGroup.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationVelocity.y);
    }

    // 2. Update Small Particles (GPU Side)
    smallDotsMeshes.forEach((mesh) => {
      const uniforms = mesh.material.uniforms;
      uniforms.uTime.value = time;
      
      // Handle visibility and spread using uMorph
      if (!isFindMode) {
        uniforms.uMorph.value = 1.0 - spreadEase;
        // Snappier opacity fade matching the quintic motion
        const opacityMult = introProgress < 1 ? (0.3 + Math.pow(introProgress, 0.4) * 0.7) : 1.0;
        uniforms.uBaseOpacity.value = mesh.userData.baseOpacity * opacityMult;
      }
    });

    // 3. Update Artworks & Labels
    const camPos = camera.position;
    const globeCenter = _v1.set(0, 0, 0);
    globeGroup.getWorldPosition(globeCenter);

    artworkMeshes.forEach((mesh, i) => {
      const findModeOffset = 1.0 - morphProgress;
      const baseScale = CONFIG.globe.artworkDotSize * 3;
      mesh.scale.set(baseScale * findModeOffset, baseScale * findModeOffset, 1);
      
      if (mesh.userData.originalLocalPos) {
        mesh.position.copy(mesh.userData.originalLocalPos).multiplyScalar(findModeOffset);
      }

      mesh.getWorldPosition(_v2);
      _v3.copy(camPos).sub(_v2).normalize(); // View Direction
      const surfNormal = _v2.clone().sub(globeCenter).normalize();
      const NdotV = _v3.dot(surfNormal);

      // Intro fading logic
      const specificDotFadeStart = dotFadeStartBase + mesh.userData.introDelay;
      let dotIntroOpacity = 0;
      if (elapsed > specificDotFadeStart) {
        dotIntroOpacity = Math.min(1, (elapsed - specificDotFadeStart) / anim.dotFadeDuration);
      }

      const fadeCurve = Math.max(0, NdotV);
      const targetOpacity = Math.pow(fadeCurve, 0.6);
      mesh.material.opacity = targetOpacity * dotIntroOpacity;
      
      const gray = 0.85 * (1 - targetOpacity);
      mesh.material.color.setRGB(gray, gray, gray);

      // Label positioning
      const labelObj = labelElements[i];
      if (!isConverging && !isFindMode) {
        _v2.project(camera);
        const rect = appContainer.getBoundingClientRect();
        const x = (_v2.x * 0.5 + 0.5) * rect.width;
        const y = (_v2.y * -0.5 + 0.5) * rect.height;
        const appScale = rect.width / 480;

        labelObj.element.style.left = `${x.toFixed(1)}px`;
        labelObj.element.style.top = `${y.toFixed(1)}px`;
        labelObj.element.style.transform = `translate(-50%, ${(12 * appScale).toFixed(1)}px)`;
        
        const labelAlpha = targetOpacity * dotIntroOpacity;
        labelObj.element.style.opacity = labelAlpha.toFixed(2);
        labelObj.element.style.pointerEvents = labelAlpha > 0.3 ? 'auto' : 'none';
      } else {
        labelObj.element.style.opacity = '0';
        labelObj.element.style.pointerEvents = 'none';
      }
    });

    renderer.render(scene, camera);
  }

  animate();

  // ===============================
  // Resize Handler
  // ===============================
  window.addEventListener('resize', () => {
    updateViewport();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();
