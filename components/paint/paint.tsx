"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./paint.module.css";
import Image from "next/image";
import Canvas from "./canvas";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function Paint() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const { getNextZIndex } = useZIndex();

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      if (isDragging && boxRef.current) {
        boxRef.current.style.left = `${e.clientX - offset.x}px`;
        boxRef.current.style.top = `${e.clientY - offset.y}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (e: { clientX: number; clientY: number }) => {
    const box = boxRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (visible && boxRef.current) {
      const newZIndex = getNextZIndex();
      boxRef.current.style.zIndex = newZIndex.toString();
    }
  }, [visible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      setIsClosing(false);
    }, 200); // Match the animation duration
  };

  return (
    <div>
      <div className={styles.icon} onClick={() => setVisible(true)}>
        <Image src={"/paint.webp"} alt="Logo" width={45} height={45} />
        <h2>Paint</h2>
      </div>
      {visible && (
        <div ref={boxRef} onMouseDown={() => {
          // Bring this component to front
          const newZIndex = getNextZIndex();
          boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
        }} className={`${styles.container} ${isClosing ? styles.closing : ''}`}>
          <div
            onMouseDown={handleMouseDown}
            className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
          >
            <Image src={"/paint.webp"} alt="Logo" width={20} height={20} />
            <h2 className={styles.title}>Paint</h2>
            <div className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={"/exit.webp"} alt="Close" width={25} height={25} />
            </div>
          </div>
          <div className={styles.canvas}>
            <svg
              width="1056"
              height="402"
              viewBox="0 0 1056 402"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M559.501 58.8902C536.165 58.8902 512.515 58.3064 489.322 61.0757C476.933 62.555 462.543 62.3611 451.865 69.9391C439.931 78.4085 431.796 93.8805 426.186 106.971C417.741 126.675 413.731 148.039 411.555 169.319C410.406 180.556 410.887 191.977 410.887 203.255C410.887 218.582 410.874 234.061 414.651 249.029C420.882 273.721 436.08 298.845 453.565 317.204C471.653 336.196 497.333 344.343 522.833 346.709C541.164 348.409 563.688 350.093 580.263 340.577C597.933 330.434 604.251 312.924 607.521 293.71C611.833 268.382 611.953 241.887 611.953 216.246C611.953 194.292 610.689 173.89 606.429 152.32C601.539 127.567 597.469 98.9241 582.995 77.5277C578.319 70.6143 572.413 59.5518 563.872 56.7047"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M508.142 102.6C510.902 102.6 513.17 105.724 515.791 105.878C519.503 106.097 523.105 108.064 527.265 108.064C533.093 108.064 538.921 108.064 544.749 108.064C549.337 108.064 553.147 105.878 557.316 105.878"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M510.327 124.455C513.319 124.455 516.431 126.486 519.069 126.641C522.322 126.832 525.645 126.641 528.904 126.641"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M411.98 147.403C404.708 147.403 395.386 151.656 391.46 158.33C388.45 163.447 389.032 168.726 389.032 174.722C389.032 185.198 400.131 196.491 410.887 191.113"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M604.304 127.733C609.46 127.733 609.702 132.225 613.046 135.383C616.328 138.483 618.249 141.613 618.51 146.31C618.756 150.749 620.771 154.881 618.752 159.423C616.675 164.096 613.882 164.329 609.768 167.072"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M458.968 253.4C463.702 253.873 469.329 256.689 473.781 258.378C481.106 261.156 488.649 263.819 495.879 266.756C509.097 272.126 521.269 273.327 535.461 273.069C546.171 272.875 554.602 264.815 564.115 261.292C568.884 259.526 572.001 255.061 576.985 253.4"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M519.069 292.739C524.995 292.739 537.876 293.372 540.924 287.275"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M414.165 147.403C440.137 147.403 466.761 149.411 492.236 154.506C509.884 158.035 528.961 156.145 546.934 156.145C561.054 156.145 574.152 153.222 587.913 151.774C592.021 151.342 596.165 147.874 599.933 147.403C602.539 147.077 609.116 143.032 606.489 143.032"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M411.98 172.536C421.935 172.536 431.409 171.444 441.484 171.444C454.255 171.444 447.561 185.656 454.354 192.449C457.228 195.322 459.901 199.477 463.946 200.948C471.344 203.638 479.519 205.319 487.38 205.319C492.95 205.319 514.174 207.67 514.698 198.762C514.973 194.089 514.833 188.595 515.852 184.01C517.38 177.133 521.881 178 527.811 178C536.168 178 532.116 196.577 542.017 196.577C546.635 196.577 550.684 198.796 555.676 196.577C561.901 193.81 568.517 191.953 575.042 189.777C581.78 187.532 587.774 185.196 593.923 181.885C598.419 179.464 604.046 178.516 606.489 173.629"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M416.351 122.27C419.966 122.27 422.214 125.548 426.185 125.548C430.188 125.548 428.593 117.89 427.764 115.167C427.499 114.298 423.097 104.226 420.965 106.121C418.433 108.372 426.628 118.306 427.825 119.963C431.393 124.904 433.439 121.755 433.774 117.231C434.374 109.136 432.882 101.563 430.799 93.8582C430.186 91.5897 426.058 82.4818 427.825 89.5479C429.683 96.9801 433.734 103.395 439.056 108.914C444.052 114.095 442.633 106.679 442.577 102.6C442.502 97.2318 441.826 84.3121 436.567 80.8059C429.97 76.4079 442.767 100.595 448.526 93.1904C452.313 88.3218 450.979 74.1472 448.89 68.9678C448.284 67.4629 441.484 56.9304 441.484 63.3219C441.484 74.5317 452.825 77.4357 462.793 75.2207C467.524 74.1693 457.875 54.8766 457.875 70.9104C457.875 77.074 458.537 78.1027 463.339 81.838C467.389 84.9877 471.272 86.1314 470.988 79.8953C470.801 75.7695 465.056 66.4959 460.607 65.5074C457.125 64.7336 457.805 72.5454 457.875 74.4315C457.992 77.5825 463.697 84.9948 467.103 84.9948C469.22 84.9948 468.763 81.8724 468.074 80.7452C465.85 77.1058 460.525 74.9935 456.54 74.4315C453.937 74.0646 443.67 70.8824 443.67 75.2814C443.67 80.18 445.279 83.443 447.555 87.7874C448.678 89.9316 454.933 96.3149 457.875 93.3725C464.636 86.6117 456.522 73.3806 453.504 67.2072C451.817 63.7552 449.927 59.4512 447.555 56.4011C446.7 55.3018 447.894 60.2346 448.283 60.8329C452.735 67.6696 464.849 69.7237 471.96 72.4889C476.426 74.2257 476.696 71.0766 473.781 67.3894C472.15 65.3271 462.774 58.8577 460.121 62.8362C451.927 75.1278 475.142 78.5597 481.916 78.5597C488.524 78.5597 488.315 74.1278 486.772 68.1786C486.331 66.474 478.848 56.4083 478.638 59.9829C478.211 67.2254 481.977 72.0032 489.565 72.0032C500.392 72.0032 476.921 42.4372 469.896 56.0976C464.128 67.3126 476.355 76.2527 485.862 78.0133C487.807 78.3735 501.698 80.2652 501.585 77.2241C501.298 69.4586 490.579 63.0755 485.801 57.9796C482.498 54.4567 483.471 61.3069 487.38 63.2612C494.618 66.8802 502.153 68.1548 508.567 73.5816C514.615 78.6997 507.226 64.9851 506.199 63.504C502.948 58.8166 498.351 52.6469 492.297 51.3016C488.796 50.5236 491.515 57.2144 492.297 58.3438C495.153 62.4692 498.799 65.5729 503.771 66.7823C507.209 67.6185 514.147 69.362 515.791 64.8396C518.053 58.6193 506.998 50.4983 502.678 47.1128C496.113 41.9672 500.457 56.2145 501.646 58.8902C503.09 62.1398 510.057 77.453 515.791 75.0386C522.157 72.3584 522.597 50.712 513.606 51.2409C511.298 51.3766 512.638 55.867 513.848 56.7047C517.527 59.2517 522.289 61.6831 526.658 62.2291C527.248 62.3029 535.237 64.532 534.125 62.1684C532.666 59.0683 529.07 58.8902 526.172 58.8902C521.24 58.8902 521.255 59.1224 521.255 64.1111C521.255 67.286 522.141 72.0032 526.172 72.0032C535.471 72.0032 523.578 42.2501 521.315 38.8564C517.882 33.7055 522.566 51.7779 526.233 56.7654C531.189 63.5053 537.379 70.7223 545.902 72.8531C560.076 76.3965 540.161 42.1601 535.703 47.1128C533.754 49.2786 535.863 54.5299 537.646 55.8548C542.529 59.4821 550.651 62.3928 556.708 63.2005C569.456 64.9002 548.692 43.1932 547.542 52.3944C546.666 59.3953 549.448 63.4737 552.884 69.2713C553.499 70.3089 557.3 78.8772 560.351 76.1314C568.303 68.9742 560.682 54.2598 552.945 50.391C549.286 48.5616 550.685 57.4061 551.427 58.8902C554.431 64.898 561.076 67.5645 566.907 69.8177C569.427 70.7912 574.8 72.6275 574.8 68.6642C574.8 64.1157 568.974 61.142 564.965 60.2258C552.238 57.3168 565.702 77.9705 569.943 80.6845C571.448 81.6475 582.729 87.6286 584.391 85.9661C588.281 82.0765 571.497 66.4625 569.457 64.5361C567.813 62.9831 559.501 55.1026 559.501 61.3185C559.501 71.2832 563.179 79.6828 568.789 87.7874C572.028 92.4647 579.134 103.346 585.727 103.693C590.213 103.929 587.756 92.6725 587.305 90.0336C586.104 82.9964 583.397 72.7755 578.685 67.2072C574.846 62.6703 575.37 67.7703 576.985 70.9104C579.783 76.3517 587.379 78.725 592.83 80.1381C594.878 80.6692 603.404 83.9867 600.54 78.5597C597.941 73.6361 588.801 67.7536 583.056 67.7536C578.876 67.7536 582.901 77.2425 583.542 78.5597C585.359 82.2956 602.57 98.8755 600.783 90.3371C599.648 84.9132 585.386 68.3833 586.881 81.838C587.581 88.1385 600.705 110.284 608.068 98.7149C610.385 95.0736 608.776 87.0303 606.489 83.7806C605.622 82.5484 599.684 75.9529 598.901 80.2595C597.061 90.3791 606.907 99.9181 614.685 104.239C619.367 106.84 617.537 96.0327 617.295 93.8582C616.526 86.9319 609.246 77.3061 602.118 75.5243C599.516 74.8736 594.469 74.3031 594.469 78.0133C594.469 80.0442 593.406 85.9808 595.562 87.0589C597.11 87.833 596.65 84.9105 596.412 84.2663C594.991 80.4312 588.868 77.6882 585.484 76.4349C573.836 72.1208 558.964 68.4939 546.388 69.8177C543.481 70.1237 546.069 78.6417 546.934 80.1988C548.069 82.2403 536.896 76.3812 534.368 75.7671C518.469 71.9061 526.863 84.2934 530.422 82.87C537.314 80.1129 515.806 79.4622 508.385 79.6525C504.842 79.7433 497.26 81.7718 498.368 86.7553C499.115 90.1184 505.52 87.5548 500.25 86.4518C492.54 84.8382 485.321 86.0825 479.791 91.612C476.714 94.6894 478.798 98.8786 478.638 94.7081C478.442 89.6296 470.236 90.2848 466.678 90.6407C464.638 90.8446 459.006 93.7751 461.761 96.5294C463.964 98.7331 468.694 99.322 462.003 99.322C455.611 99.322 449.888 98.4391 449.194 106.425C448.975 108.947 447.761 114.83 451.319 114.62C453.202 114.51 453.175 107.895 450.772 109.764C447.451 112.347 445.734 116.32 442.82 119.234C440.793 121.261 440.294 121.002 437.659 119.538C435.425 118.296 431.706 120.197 430.556 117.899"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M579.171 122.27C579.171 127.72 579.986 132.33 575.65 136.233C573.539 138.132 560.489 140.846 567.15 140.846C573.414 140.846 578.081 140.304 582.449 145.217C583.928 146.882 584.864 150.646 586.273 151.774C587.015 152.367 586.751 159.075 587.67 157.238C589.961 152.655 586.543 146.537 589.248 141.939C590.695 139.48 593.375 137.568 596.108 137.568C600.506 137.568 598.984 137.758 595.562 137.568C586.354 137.057 582.505 124.568 579.171 117.899"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <Canvas color={selectedColor} />
          </div>
          <div className={styles.colorPicker}>
            <div className={styles.selectedColor}>
              <div
                className={styles.colorBox}
                style={{ backgroundColor: selectedColor }}
              />
            </div>
            <div className={styles.colorPalette}>
              <div
                className={styles.color}
                style={{ backgroundColor: "#000000" }}
                onClick={() => setSelectedColor("#000000")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#ffffff" }}
                onClick={() => setSelectedColor("#ffffff")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#81827f" }}
                onClick={() => setSelectedColor("#81827f")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#c2c0bc" }}
                onClick={() => setSelectedColor("#c2c0bc")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#7f0107" }}
                onClick={() => setSelectedColor("#7f0107")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#ff0107" }}
                onClick={() => setSelectedColor("#ff0107")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#7c8301" }}
                onClick={() => setSelectedColor("#7c8301")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#fffd0a" }}
                onClick={() => setSelectedColor("#fffd0a")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#087f0b" }}
                onClick={() => setSelectedColor("#087f0b")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#03fc09" }}
                onClick={() => setSelectedColor("#03fc09")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#05807b" }}
                onClick={() => setSelectedColor("#05807b")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#03fef9" }}
                onClick={() => setSelectedColor("#03fef9")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#020080" }}
                onClick={() => setSelectedColor("#020080")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#0501f6" }}
                onClick={() => setSelectedColor("#0501f6")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#7c0380" }}
                onClick={() => setSelectedColor("#7c0380")}
              />
              <div
                className={styles.color}
                style={{ backgroundColor: "#f807f5" }}
                onClick={() => setSelectedColor("#f807f5")}
              />
            </div>
          </div>
          <div className={styles.tip}>
            <p>
              Feel free to improve on my drawing!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
