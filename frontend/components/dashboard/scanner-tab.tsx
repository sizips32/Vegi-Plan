"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  ScanLine,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppState } from "@/hooks/use-app-state";

interface MockIngredient {
  name: string;
  isVegan: boolean;
}

type ScanState = "idle" | "analyzing" | "result";

const MOCK_INGREDIENTS: MockIngredient[] = [
  { name: "Soy Lecithin", isVegan: true },
  { name: "Sugar", isVegan: true },
  { name: "Natural Flavors", isVegan: false },
  { name: "Palm Oil", isVegan: true },
  { name: "Citric Acid", isVegan: true },
];

export function ScannerTab() {
  const { t } = useLanguage();
  const { isLoaded } = useAppState();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [isVeganResult, setIsVeganResult] = useState(true);
  const [ingredients, setIngredients] = useState<MockIngredient[]>([]);

  const handleUpload = useCallback(() => {
    setScanState("analyzing");

    const timer = setTimeout(() => {
      const veganFriendly = Math.random() > 0.5;
      setIsVeganResult(veganFriendly);

      if (veganFriendly) {
        setIngredients(MOCK_INGREDIENTS.map((i) => ({ ...i, isVegan: true })));
      } else {
        setIngredients(MOCK_INGREDIENTS);
      }

      setScanState("result");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleReset = useCallback(() => {
    setScanState("idle");
    setIsVeganResult(true);
    setIngredients([]);
  }, []);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {scanState === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanLine className="size-5" />
                  {t.scanner.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t.scanner.description}
                </p>
              </CardHeader>
              <CardContent>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-12 transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-primary/10 p-4"
                  >
                    <Upload className="size-8 text-primary" />
                  </motion.div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">
                      {t.scanner.upload}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.scanner.dragDrop}
                    </p>
                  </div>
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {scanState === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="size-12 text-primary" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-lg font-medium text-foreground"
                >
                  {t.scanner.analyzing}
                </motion.p>
                <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        delay: i * 0.4,
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                      className="h-2 origin-left rounded-full bg-primary/20"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {scanState === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Verdict */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card
                className={
                  isVeganResult
                    ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "border-red-500/30 bg-red-50/50 dark:bg-red-950/20"
                }
              >
                <CardContent className="flex items-center gap-4 py-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 12,
                    }}
                  >
                    {isVeganResult ? (
                      <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="size-10 text-red-600 dark:text-red-400" />
                    )}
                  </motion.div>
                  <div>
                    <Badge
                      variant={isVeganResult ? "default" : "destructive"}
                      className={
                        isVeganResult
                          ? "bg-emerald-600 hover:bg-emerald-600 dark:bg-emerald-500"
                          : ""
                      }
                    >
                      {isVeganResult
                        ? "Vegan-Friendly"
                        : "Contains Non-Vegan Ingredients"}
                    </Badge>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isVeganResult
                        ? t.scanner.resultVegan
                        : t.scanner.resultNonVegan}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detected Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t.scanner.detectedIngredients}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <motion.li
                        key={ingredient.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.08 }}
                        className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-2.5"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {ingredient.name}
                        </span>
                        {ingredient.isVegan ? (
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-600 dark:text-red-400">
                              Potentially non-vegan
                            </span>
                            <XCircle className="size-4 text-red-600 dark:text-red-400" />
                          </div>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Try Another */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="size-4" />
                {t.scanner.tryAnother}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
