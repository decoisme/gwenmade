"use client";

import { useEffect, useRef } from "react";

export function BrandMark({ label }: { label: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let geometry: import("three").ExtrudeGeometry | null = null;
    let plinthGeometry: import("three").BoxGeometry | null = null;
    let markMaterial: import("three").MeshStandardMaterial | null = null;
    let plinthMaterial: import("three").MeshStandardMaterial | null = null;
    let mark: import("three").Mesh | null = null;
    let visible = true;
    let scene: import("three").Scene | null = null;
    let camera: import("three").PerspectiveCamera | null = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;

    const renderFrame = () => {
      if (!renderer || !visible || !scene || !camera) return;
      if (!reduceMotion && mark) {
        currentY += (pointerX * 0.22 - currentY) * 0.045;
        currentX += (-pointerY * 0.12 - currentX) * 0.045;
        mark.rotation.y = -0.32 + currentY;
        mark.rotation.x = -0.12 + currentX;
      }
      renderer.render(scene, camera);
      if (!reduceMotion) frame = window.requestAnimationFrame(renderFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduceMotion) return;
      const bounds = mount.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const handlePointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };

    const setup = async () => {
      try {
        const THREE = await import("three");
        if (cancelled) return;

        const bounds = mount.getBoundingClientRect();
        const activeScene = new THREE.Scene();
        const activeCamera = new THREE.PerspectiveCamera(33, Math.max(bounds.width, 1) / Math.max(bounds.height, 1), 0.1, 100);
        activeCamera.position.set(0, 0.2, 7.4);
        scene = activeScene;
        camera = activeCamera;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(Math.max(bounds.width, 1), Math.max(bounds.height, 1));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mount.appendChild(renderer.domElement);
        mount.classList.add("is-ready");

        const shape = new THREE.Shape();
        shape.moveTo(1.05, 1.25);
        shape.lineTo(-1.05, 1.25);
        shape.lineTo(-1.05, -1.25);
        shape.lineTo(1.05, -1.25);
        shape.lineTo(1.05, -0.12);
        shape.lineTo(0.1, -0.12);
        shape.lineTo(0.1, -0.56);
        shape.lineTo(0.55, -0.56);
        shape.lineTo(0.55, -0.32);
        shape.lineTo(0.82, -0.32);
        shape.lineTo(0.82, -1.02);
        shape.lineTo(-0.78, -1.02);
        shape.lineTo(-0.78, 1.02);
        shape.lineTo(0.82, 1.02);
        shape.lineTo(0.82, 0.52);
        shape.lineTo(0.12, 0.52);
        shape.lineTo(0.12, 0.12);
        shape.lineTo(1.05, 0.12);
        shape.lineTo(1.05, 1.25);
        const options: import("three").ExtrudeGeometryOptions = { depth: 0.32, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.055, bevelThickness: 0.055 };
        geometry = new THREE.ExtrudeGeometry(shape, options);
        geometry.center();

        markMaterial = new THREE.MeshStandardMaterial({ color: 0xbd4c31, roughness: 0.48, metalness: 0.02 });
        mark = new THREE.Mesh(geometry, markMaterial);
        mark.position.set(0, 0.18, 0.28);
        activeScene.add(mark);

        plinthGeometry = new THREE.BoxGeometry(3.9, 0.16, 2.4);
        plinthMaterial = new THREE.MeshStandardMaterial({ color: 0xe4dfd4, roughness: 0.78, metalness: 0 });
        const plinth = new THREE.Mesh(plinthGeometry, plinthMaterial);
        plinth.position.set(0, -1.27, 0.06);
        activeScene.add(plinth);

        activeScene.add(new THREE.AmbientLight(0xffffff, 1.1));
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
        keyLight.position.set(-3, 5, 6);
        activeScene.add(keyLight);
        const sideLight = new THREE.DirectionalLight(0xf4d4bd, 0.55);
        sideLight.position.set(4, 1, 3);
        activeScene.add(sideLight);

        resizeObserver = new ResizeObserver(() => {
          if (!renderer) return;
          const size = mount.getBoundingClientRect();
          activeCamera.aspect = Math.max(size.width, 1) / Math.max(size.height, 1);
          activeCamera.updateProjectionMatrix();
          renderer.setSize(Math.max(size.width, 1), Math.max(size.height, 1));
          if (reduceMotion) renderer.render(activeScene, activeCamera);
        });
        resizeObserver.observe(mount);

        intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          window.cancelAnimationFrame(frame);
          if (visible) {
            if (reduceMotion) renderer?.render(activeScene, activeCamera);
            else frame = window.requestAnimationFrame(renderFrame);
          }
        }, { threshold: 0.05 });
        intersectionObserver.observe(mount);
        mount.addEventListener("pointermove", handlePointerMove);
        mount.addEventListener("pointerleave", handlePointerLeave);
        if (!reduceMotion) frame = window.requestAnimationFrame(renderFrame);
        else renderer.render(activeScene, activeCamera);
      } catch {
        mount.classList.remove("is-ready");
      }
    };

    void setup();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      renderer?.dispose();
      geometry?.dispose();
      plinthGeometry?.dispose();
      markMaterial?.dispose();
      plinthMaterial?.dispose();
      if (renderer?.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      mount.classList.remove("is-ready");
    };
  }, []);

  return (
    <div className="brand-mark-stage" ref={mountRef} role="img" aria-label={label}>
      <div className="brand-mark-fallback" aria-hidden="true">G<span /></div>
    </div>
  );
}
