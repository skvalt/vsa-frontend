import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

const DockContext = createContext();

function useDock() {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("useDock must be inside DockProvider");
  return ctx;
}

export function Dock({
  children,
  className = "",
  distance = 140,
  magnification = 75,
  panelHeight = 64,
  spring = { mass: 0.15, stiffness: 160, damping: 14 },
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(120, magnification + magnification / 2 + 6),
    [magnification]
  );

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height }} className="mx-2 flex max-w-full items-end">
      <motion.div
        onMouseMove={(e) => {
          isHovered.set(1);
          mouseX.set(e.pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={clsx(
          "mx-auto flex w-fit gap-5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border border-white/10 shadow-lg px-5 py-3",
          className
        )}
        style={{ height: panelHeight }}
      >
        <DockContext.Provider
          value={{ mouseX, spring, distance, magnification }}
        >
          {children}
        </DockContext.Provider>
      </motion.div>
    </motion.div>
  );
}

export function DockItem({ children }) {
  const ref = useRef(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect() || { x: 0, width: 0 };
    return x - rect.x - rect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [38, magnification, 38]
  );

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="relative inline-flex items-center justify-center"
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
    >
      {Children.map(children, (child) =>
        cloneElement(child, { width, isHovered })
      )}
    </motion.div>
  );
}

export function DockLabel({ children, isHovered }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = isHovered.on("change", (v) => setVisible(v === 1));
    return () => unsub();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -12 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-md shadow-xl backdrop-blur-md"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DockIcon({ children, width }) {
  const size = useTransform(width, (w) => w / 2);

  return (
    <motion.div
      style={{ width: size, height: size }}
      className="flex items-center justify-center text-white"
    >
      {children}
    </motion.div>
  );
}
