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
      rotationDamping: 0.92,
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
    },
  };

  let currentLang = 'ko';
  let isArtworkDetailOpen = false;
  let selectedArtworkIndex = -1;
  let isConverging = false;

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

  // Fix horizontal FOV so globe always looks the same width relative to screen
  const TARGET_HFOV = 42; // degrees - fixed horizontal field of view

  function updateViewport() {
    const w = appContainer.clientWidth;
    const h = appContainer.clientHeight;
    const aspect = w / h;
    
    // Convert fixed horizontal FOV to vertical FOV based on current aspect ratio
    const hFovRad = TARGET_HFOV * Math.PI / 180;
    const vFovRad = 2 * Math.atan(Math.tan(hFovRad / 2) / aspect);
    camera.fov = vFovRad * 180 / Math.PI;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

    // Globe scale stays 1.0 — no scaling needed since camera handles it
    globeGroup.scale.set(1, 1, 1);

    // Position globe between header and bottom text
    const headerHeight = 60;
    const bottomHeight = 280;
    const offsetPx = (bottomHeight - headerHeight) / 2;
    const vFovRad2 = camera.fov * Math.PI / 180;
    const visibleHeight = 2 * Math.tan(vFovRad2 / 2) * CONFIG.camera.z;
    const offsetWorld = (offsetPx / h) * visibleHeight;
    globeGroup.position.y = offsetWorld;
  }
  updateViewport();

  // --- Small dots (sphere shell) ---
  const smallDotsMeshes = [];
  const sizes = [0.009, 0.014, 0.021];
  const opacities = [0.4, 0.7, 0.9];
  const proportions = [0.6, 0.3, 0.1]; // Distribution of sizes

  // Custom vertex/fragment shaders for Fresnel edge-fading
  const particleVertexShader = `
    uniform float uPointSize;
    varying float vFresnel;
    void main() {
      // Surface normal for a sphere = normalized local position
      vec3 normal = normalize(position);
      // Transform normal to world/view space
      vec3 worldNormal = normalize(normalMatrix * normal);
      // View direction in view space
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec3 viewDir = normalize(-mvPosition.xyz);
      // Fresnel: dot(viewDir, normal). 1 = facing camera, 0 = edge
      float NdotV = dot(viewDir, worldNormal);
      vFresnel = NdotV;
      // Size attenuation - DPR independent (renderer handles pixel scaling)
      gl_PointSize = uPointSize * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  const particleFragmentShader = `
    uniform float uBaseOpacity;
    uniform vec3 uColor;
    varying float vFresnel;
    void main() {
      // Remap NdotV from [-1, 1] to [0, 1]
      // -1 = directly behind, 0 = edge, 1 = directly facing
      float facing = clamp((vFresnel + 1.0) * 0.5, 0.0, 1.0);
      // Apply curve so front stays crisp, fading is gradual
      float fadeCurve = pow(facing, 0.7);
      // Alpha: back particles floor at 15% of base, front at 100%
      float alpha = uBaseOpacity * mix(0.15, 1.0, fadeCurve);
      // Color: back particles darker gray, front black
      vec3 color = mix(vec3(0.5), uColor, fadeCurve);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  sizes.forEach((size, index) => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const originals = [];
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
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPointSize: { value: size * 800 },
        uBaseOpacity: { value: opacities[index] },
        uColor: { value: new THREE.Color(0x000000) },
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

  const artworkMeshes = [];
  const artworkRings = [];
  const labelsContainer = document.getElementById('labels-container');
  const labelElements = [];

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
    dot.userData = { artworkIndex: index, originalPos: pos.clone(), introDelay: randomDelay };

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
    
    // Add touchstart to handle mobile properly
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
      // If we clicked the globe but not a dot, close the detail
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

    // Rotate globe so clicked dot faces camera
    const dot = artworkMeshes[index];
    const dotLocalPos = dot.position.clone().normalize();
    const dotWorldDir = dotLocalPos.clone().applyQuaternion(globeGroup.quaternion).normalize();
    
    // Target direction: directly from globe center to camera
    const globeCenter = new THREE.Vector3();
    globeGroup.getWorldPosition(globeCenter);
    const targetDir = camera.position.clone().sub(globeCenter).normalize();
    
    const rotationQuat = new THREE.Quaternion().setFromUnitVectors(dotWorldDir, targetDir);
    const startQuat = globeGroup.quaternion.clone();
    const targetQuat = rotationQuat.multiply(startQuat);

    const rotateStartTime = performance.now();
    const rotateDuration = 400;

    isArtworkDetailOpen = true;
    showArtworkInIntro(index);

    function animateRotateToCenter(now) {
      const elapsed = now - rotateStartTime;
      const t = Math.min(elapsed / rotateDuration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      globeGroup.quaternion.copy(startQuat).slerp(targetQuat, ease);

      if (t < 1) {
        requestAnimationFrame(animateRotateToCenter);
      }
    }

    requestAnimationFrame(animateRotateToCenter);
  }

  // Store original intro text for restoring later
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

    // Fade out
    titleEl.style.opacity = '0';
    if (mainTitleEl.style.display === 'block') mainTitleEl.style.opacity = '0';
    textEl.style.opacity = '0';
    if (actionsEl.style.display === 'flex') actionsEl.style.opacity = '0';

    // After fade out, swap text and fade in
    setTimeout(() => {
      titleEl.textContent = newTitle;
      mainTitleEl.textContent = newMainTitle;
      textEl.textContent = newText;
      hintEl.textContent = newHint;

      mainTitleEl.style.display = 'block';
      actionsEl.style.display = 'flex';

      // We need a tiny delay before setting opacity to 1 so the display:block takes effect for transition
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
    lastInteractionTime = performance.now(); // Reset auto-rotate timer

    const titleEl = document.getElementById('introTitle');
    const mainTitleEl = document.getElementById('introMainTitle');
    const textEl = document.getElementById('introText');
    const actionsEl = document.getElementById('introActions');
    const hintEl = document.getElementById('globeHint');

    // Fade out
    titleEl.style.opacity = '0';
    mainTitleEl.style.opacity = '0';
    textEl.style.opacity = '0';
    actionsEl.style.opacity = '0';

    // After fade out, restore original text and fade in
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

  // ===============================
  // Drag Rotation (touch + mouse)
  // ===============================
  let isDragging = false;
  let previousPosition = { x: 0, y: 0 };
  let rotationVelocity = { x: 0, y: 0 };
  let dragStartTime = 0;
  let dragMoved = false;
  let lastInteractionTime = 0; // Track when user last touched the globe
  const AUTO_ROTATE_PAUSE = 3000; // ms to wait before resuming auto-rotate
  const AUTO_ROTATE_FADE_IN = 1000; // ms to fade auto-rotate back to full speed

  function getEventPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function onPointerDown(e) {

    // Check if touch/mouse actually hit the globe
    const rect = canvas.getBoundingClientRect();
    const pos = getEventPos(e);
    mouse.x = ((pos.x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((pos.y - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObject(hitSphere);
    if (intersects.length === 0) return; // User clicked the background, ignore
    
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
      // If we start moving while in detail mode, close it

      if (isArtworkDetailOpen) {
        closeArtworkDetail();
      }
    }

    const sensitivity = 0.005;
    rotationVelocity.x = deltaY * sensitivity;
    rotationVelocity.y = deltaX * sensitivity;

    // Rotate around world axes to prevent unintuitive "backward" feeling when tilted
    globeGroup.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rotationVelocity.x);
    globeGroup.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationVelocity.y);

    previousPosition = pos;
  }

  function onPointerUp(e) {
    isDragging = false;
    if (dragStartTime === 0) return; // Ignore if down event didn't start on canvas
    
    lastInteractionTime = performance.now(); // Record when user stopped
    const elapsed = performance.now() - dragStartTime;

    // Click detection: short tap without significant drag
    if (!dragMoved && elapsed < 300) {
      onArtworkClick(e);
    }
    
    dragStartTime = 0; // Reset
  }

  canvas.addEventListener('mousedown', onPointerDown);
  canvas.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  canvas.addEventListener('mouseleave', () => { isDragging = false; });

  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  canvas.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // ===============================
  // Language Toggle
  // ===============================
  const langToggle = document.getElementById('langToggle');
  langToggle.addEventListener('click', () => {
    const nextLang = currentLang === 'ko' ? 'en' : 'ko';

    // Update toggle UI immediately
    document.querySelectorAll('.lang-option').forEach((el) => {
      el.classList.toggle('active', el.dataset.lang === nextLang);
    });
    const slider = document.querySelector('.lang-slider');
    if (slider) {
      slider.style.transform = nextLang === 'en' ? 'translateX(26px)' : 'translateX(0)';
    }

    // Start fade out transition
    document.body.classList.add('lang-transitioning');

    setTimeout(() => {
      currentLang = nextLang;

      // Update all bilingual text (static HTML parts)
      document.querySelectorAll('[data-ko]').forEach((el) => {
        // Skip globeHint if in artwork detail, as showArtworkInIntro handles it
        if (el.id === 'globeHint' && isArtworkDetailOpen) return;

        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
          } else {
            el.innerHTML = text.replace(/&#10;/g, '<br>');
          }
        }
      });

      // Update HTML lang attribute
      document.documentElement.lang = currentLang === 'ko' ? 'ko' : 'en';

      // Update DOM labels
      labelElements.forEach((labelObj, i) => {
        labelObj.element.textContent = artworks[i].artist[currentLang];
      });

      // Update artwork detail if open
      if (isArtworkDetailOpen && selectedArtworkIndex >= 0) {
        showArtworkInIntro(selectedArtworkIndex, true);
      }

      // End fade transition (fade back in)
      document.body.classList.remove('lang-transitioning');
    }, 500);
  });



  // ===============================
  // Render Loop
  // ===============================
  const appStartTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const time = now * 0.001;
    const elapsed = now - appStartTime;

    // Intro animation calculations
    const INTRO_DELAY = 1000; // 1 second delay before spreading
    const INTRO_DUR = 2000; // 2 seconds for particles to form
    const FADE_DUR = 1500;  // 1.5 seconds for artwork to fade in
    
    let introProgress = 0;
    if (elapsed > INTRO_DELAY) {
      introProgress = Math.min(1, (elapsed - INTRO_DELAY) / INTRO_DUR);
    }
    const spreadEase = 1 - Math.pow(1 - introProgress, 4); // Quartic ease out
    const baseFadeStartTime = INTRO_DELAY + INTRO_DUR - 500; // Base time when fading starts

    // Auto-rotate with pause after user interaction
    if (!isDragging && !isArtworkDetailOpen && !isConverging) {
      const timeSinceInteraction = now - lastInteractionTime;
      if (timeSinceInteraction > AUTO_ROTATE_PAUSE) {
        // Gradually fade auto-rotation back in
        const fadeProgress = Math.min(1, (timeSinceInteraction - AUTO_ROTATE_PAUSE) / AUTO_ROTATE_FADE_IN);
        const currentSpeed = CONFIG.globe.autoRotateSpeed * fadeProgress;
        globeGroup.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), currentSpeed);
      }
    }

    // Inertia damping
    if (!isDragging) {
      rotationVelocity.x *= CONFIG.globe.rotationDamping;
      rotationVelocity.y *= CONFIG.globe.rotationDamping;
      globeGroup.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rotationVelocity.x);
      globeGroup.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationVelocity.y);
    }

    // Subtle breathing + fog-like fading for artwork dots
    const camPos3 = camera.position.clone();
    const globeCenter3 = new THREE.Vector3();
    globeGroup.getWorldPosition(globeCenter3);

    artworkMeshes.forEach((mesh, i) => {
      const baseScale = CONFIG.globe.artworkDotSize * 3;
      mesh.scale.set(baseScale, baseScale, 1);

      // Fog-like fading (same formula as particle shader and labels)
      const wp = new THREE.Vector3();
      mesh.getWorldPosition(wp);
      const viewDir = camPos3.clone().sub(wp).normalize();
      const surfNormal = wp.clone().sub(globeCenter3).normalize();
      const NdotV = viewDir.dot(surfNormal); // [-1, 1]
      // Fade out sharply as it approaches the edge (NdotV = 0)
      const fadeCurve = Math.max(0, NdotV);

      // Calculate this dot's specific intro opacity
      const dotFadeStartTime = baseFadeStartTime + mesh.userData.introDelay;
      let dotIntroOpacity = 0;
      if (elapsed > dotFadeStartTime) {
        dotIntroOpacity = Math.min(1, (elapsed - dotFadeStartTime) / FADE_DUR);
      }

      // Opacity: edge/back=0%, front=100%
      // Using power of 0.6 to provide a smooth, natural fade-out before hitting the edge
      const targetOpacity = Math.pow(fadeCurve, 0.6);
      mesh.material.opacity = targetOpacity * dotIntroOpacity;
      
      // Color: edge/back=light gray, front=black
      const gray = 0.85 * (1 - Math.pow(fadeCurve, 0.6));
      mesh.material.color.setRGB(gray, gray, gray);
    });

    // Organic Brownian motion for all small particles
    if (!isConverging) {
      smallDotsMeshes.forEach((mesh) => {
        // Fade in particles as they spread out (invisible before delay)
        const particleOpacityMult = introProgress < 1 ? Math.pow(introProgress, 0.5) : 1.0;
        mesh.material.uniforms.uBaseOpacity.value = mesh.userData.baseOpacity * particleOpacityMult;

        const positions = mesh.geometry.attributes.position.array;
        const originals = mesh.userData.originals;
        for (let i = 0; i < positions.length; i += 3) {
          const phase = i * 0.01;
          const targetX = originals[i];
          const targetY = originals[i + 1];
          const targetZ = originals[i + 2];
          
          positions[i] = targetX * spreadEase + Math.sin(time * 1.2 + phase) * 0.03;
          positions[i + 1] = targetY * spreadEase + Math.cos(time * 1.4 + phase) * 0.03;
          positions[i + 2] = targetZ * spreadEase + Math.sin(time * 1.0 - phase) * 0.03;
        }
        mesh.geometry.attributes.position.needsUpdate = true;
      });
    }

    // Update DOM labels positions
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    
    labelElements.forEach((labelObj, i) => {
      const mesh = artworkMeshes[i];
      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);
      
      const isHidden = isConverging;
      
      if (!isHidden) {
        // Project to screen
        const screenPos = new THREE.Vector3();
        screenPos.copy(worldPos);
        screenPos.project(camera);

        const w = appContainer.clientWidth;
        const h = appContainer.clientHeight;
        const x = (screenPos.x *  .5 + .5) * w;
        const y = (screenPos.y * -.5 + .5) * h;

        labelObj.element.style.transform = `translate(-50%, 0) translate(${x}px, ${y + 10}px)`;

        // Fog-like label fading matching the particle shader
        const camPos = camera.position.clone();
        const viewDir = camPos.sub(worldPos).normalize();
        const globeCenter = new THREE.Vector3();
        globeGroup.getWorldPosition(globeCenter);
        const surfaceNormal = worldPos.clone().sub(globeCenter).normalize();
        const NdotV = viewDir.dot(surfaceNormal); // range [-1, 1]
        const dot = artworkMeshes[i];
        const dotFadeStartTime = baseFadeStartTime + dot.userData.introDelay;
        let dotIntroOpacity = 0;
        if (elapsed > dotFadeStartTime) {
          dotIntroOpacity = Math.min(1, (elapsed - dotFadeStartTime) / FADE_DUR);
        }

        // Labels disappear at edge (NdotV=0) and are hidden on back
        const labelAlpha = Math.max(0, Math.pow(Math.max(0, NdotV), 0.6)) * dotIntroOpacity;
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();
