"use client";
import headerStyle from "@/app/styles/header.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { animationBound } from "@/app/_animation";

export default function Header() {
  return (
    <AnimatePresence>
      <motion.div className={headerStyle["header-main"]}>
        <motion.div>
          <motion.main>
            <motion.h6
              {...animationBound("left")}
              className={headerStyle["header-title"]}
            >
              Customize the shirt by creating your unique logo
            </motion.h6>
          </motion.main>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
