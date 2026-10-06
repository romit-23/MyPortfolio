import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Cpu, Hand } from "lucide-react";

const followSpring = { stiffness: 135, damping: 24, mass: 0.7 };
const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export default function RobotCompanion({ paused }: { paused: boolean }) {
  const scene = useRef<HTMLDivElement>(null);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [greeting, setGreeting] = useState(false);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const followX = useSpring(targetX, followSpring);
  const followY = useSpring(targetY, followSpring);
  const headX = useTransform(followX, [-1, 1], [-9, 9]);
  const headY = useTransform(followY, [-1, 1], [-5, 5]);
  const yaw = useTransform(followX, [-1, 1], [-20, 20]);
  const pitch = useTransform(followY, [-1, 1], [13, -13]);
  const roll = useTransform(followX, [-1, 1], [-3, 3]);
  const gazeX = useTransform(followX, [-1, 1], [-13, 13]);
  const gazeY = useTransform(followY, [-1, 1], [-9, 9]);
  const bodyX = useTransform(followX, [-1, 1], [-3, 3]);
  const bodyRoll = useTransform(followX, [-1, 1], [-2, 2]);

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const reset = () => { targetX.set(0); targetY.set(0); };
    if (paused) {
      reset();
      followX.jump(0);
      followY.jump(0);
      return;
    }
    let bounds = element.getBoundingClientRect();
    let visible = true;
    const measure = () => { bounds = element.getBoundingClientRect(); };
    const follow = (event: PointerEvent) => {
      if (!visible || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      targetX.set(clamp((event.clientX - bounds.left - bounds.width / 2) / (bounds.width * 0.8)));
      targetY.set(clamp((event.clientY - bounds.top - bounds.height * 0.44) / (bounds.height * 0.8)));
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      element.classList.toggle("is-offscreen", !visible);
      if (visible) measure(); else reset();
    });
    const resize = new ResizeObserver(measure);
    intersection.observe(element);
    resize.observe(element);
    window.addEventListener("pointermove", follow, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
      element.classList.remove("is-offscreen");
    };
  }, [paused, targetX, targetY, followX, followY]);

  useEffect(() => () => { if (greetingTimer.current) clearTimeout(greetingTimer.current); }, []);

  function sayHello() {
    if (greetingTimer.current) clearTimeout(greetingTimer.current);
    setGreeting(true);
    greetingTimer.current = setTimeout(() => setGreeting(false), 2400);
  }

  return (
    <div className={`robot-panel ${paused ? "is-paused" : ""}`}>
      <div className="robot-panel-header">
        <span className="robot-panel-title"><Cpu size={15} /> A LITTLE INTELLIGENCE</span>
        <span className="robot-online"><i /> ONLINE</span>
      </div>
      <div ref={scene} className={`robot-scene ${greeting ? "is-greeting" : ""}`}>
        <div className="robot-art" role="img" aria-label="A friendly floating robot with glowing green eyes that follows your cursor">
          <div className="robot-halo" />
          <div className="robot-orbit orbit-one" />
          <div className="robot-orbit orbit-two" />
          <span className="robot-spark spark-one" />
          <span className="robot-spark spark-two" />
          <span className="robot-spark spark-three" />
          <div className="robot-platform"><span /></div>
          <div className="robot-anchor">
            <div className="robot-float">
              <motion.div className="robot-body" style={{ x: bodyX, rotate: bodyRoll }}>
                <div className="robot-neck" />
                <div className="robot-torso"><div className="robot-heart"><i /><i /><i /></div><span className="robot-body-label">R / 01</span></div>
                <div className="robot-arm arm-left"><i /></div>
                <div className="robot-arm arm-right"><i /></div>
              </motion.div>
              <motion.div className="robot-head" style={{ x: headX, y: headY, rotateX: pitch, rotateY: yaw, rotateZ: roll, transformPerspective: 700 }}>
                <div className="robot-antenna"><span /></div>
                <div className="robot-ear ear-left" /><div className="robot-ear ear-right" />
                <div className="robot-shell">
                  <span className="robot-shell-mark" />
                  <div className="robot-visor">
                    <div className="robot-visor-reflection" />
                    <motion.div className="robot-gaze" style={{ x: gazeX, y: gazeY }}>
                      <div className="robot-eye eye-left"><i /></div>
                      <div className="robot-eye eye-right"><i /></div>
                      <svg className="robot-smile" viewBox="0 0 38 20"><path d="M5 5 Q19 19 33 5" /></svg>
                    </motion.div>
                    <span className="robot-cheek cheek-left" /><span className="robot-cheek cheek-right" />
                  </div>
                  <div className="robot-chin"><span /><i /><span /></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <span className="robot-greeting" role="status">{greeting ? "Hey there, human." : ""}</span>
        <div className="robot-scene-caption"><span className="robot-desktop-hint">Move your cursor. I’m curious.</span><span className="robot-touch-hint">A curious little companion.</span></div>
      </div>
      <div className="robot-panel-footer">
        <span>Made of code. Full of curiosity.</span>
        <button className="robot-hello" onClick={sayHello} aria-label="Say hello to the robot"><Hand size={14} /><span>Say hello</span></button>
      </div>
    </div>
  );
}
