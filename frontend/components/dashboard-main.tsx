"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, CheckCircle, Leaf, Utensils, Calendar } from "lucide-react"

// --- Mock Data ---
const nutrientData = [
    { name: "Protein", value: 85, color: "#34D399" }, // Emerald 400
    { name: "Carbs", value: 60, color: "#60A5FA" },   // Blue 400
    { name: "Fat", value: 45, color: "#F472B6" },     // Pink 400
]

const deficiencyData = [
    { name: "B12", current: 2.1, target: 2.4, unit: "µg" },
    { name: "Iron", current: 12, target: 18, unit: "mg" },
    { name: "Calcium", current: 800, target: 1000, unit: "mg" },
    { name: "Omega-3", current: 0.8, target: 1.1, unit: "g" },
    { name: "Zinc", current: 9, target: 11, unit: "mg" },
]

export default function DashboardMain() {
    const [activeTab, setActiveTab] = useState("overview")
    const [isUploading, setIsUploading] = useState(false)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 100 }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 font-sans">
            <motion.div
                className="max-w-7xl mx-auto space-y-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Hello, User <span className="text-emerald-500">🌱</span>
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
                            Lacto-Ovo Vegetarian • Goal: Muscle Gain
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Weekly Plan
                        </Button>
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                    </div>
                </motion.div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="planner">Meal Planner</TabsTrigger>
                        <TabsTrigger value="scanner">Ingredient Scanner</TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TabsContent value="overview" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Daily Progress Card */}
                                    <Card className="col-span-1 md:col-span-2 lg:col-span-1 shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle>Daily Intake</CardTitle>
                                            <CardDescription>Calories & Macros</CardDescription>
                                        </CardHeader>
                                        <CardContent className="h-[250px] flex items-center justify-center relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={nutrientData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {nutrientData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend verticalAlign="bottom" height={36} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-3xl font-bold">1,850</span>
                                                <span className="text-xs text-slate-500">kcal / 2,200</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Critical Nutrients Dashboard */}
                                    <Card className="col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                Critical Nutrients
                                                <Badge variant="secondary" className="text-xs font-normal">Vegetarian Focus</Badge>
                                            </CardTitle>
                                            <CardDescription>Tracking B12, Iron, Zinc levels</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                {deficiencyData.map((item) => (
                                                    <div key={item.name} className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-slate-500">
                                                                {item.current} / {item.target} {item.unit}
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={(item.current / item.target) * 100}
                                                            className={`h-2 ${(item.current / item.target) < 0.8 ? "bg-red-100" : "bg-slate-100"
                                                                }`}
                                                        // Note: Shadcn Progress component handles bar color via class or indicator style override.
                                                        // Customizing bar color would require modifying the component or passing a class to the Indicator if exposed.
                                                        // For simplicity, relying on default or global styles, but ideally we'd color-code based on value.
                                                        />
                                                        {(item.current / item.target) < 0.8 && (
                                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                                <Leaf className="h-3 w-3" /> Consider a supplement or fortified foods.
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Upcoming Meal Card */}
                                    <Card className="col-span-1 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border-none">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Utensils className="h-5 w-5 text-emerald-600" />
                                                Next Meal Suggestion
                                            </CardTitle>
                                            <CardDescription>Based on your lunch ingredients (&quot;Smart Leftover&quot; Logic)</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quinoa Stuffed Bell Peppers</h3>
                                                        <p className="text-sm text-slate-500 mt-1">Utilizes remaining quinoa from lunch + fresh bell peppers.</p>
                                                    </div>
                                                    <Badge className="bg-emerald-500 hover:bg-emerald-600">Dinner</Badge>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="text-slate-600 bg-white/50">High Iron</Badge>
                                                    <Badge variant="outline" className="text-slate-600 bg-white/50">Vitamin C</Badge>
                                                </div>
                                                <Button className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800">
                                                    View Recipe & Prep
                                                </Button>
                                            </div>
                                            <div className="h-48 w-full bg-slate-200 rounded-lg overflow-hidden relative group">
                                                {/* Placeholder image area */}
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                                                    <Leaf className="h-12 w-12 opacity-20" />
                                                    <span className="sr-only">Food Image</span>
                                                </div>
                                                {/* In real app, next/image would go here */}
                                            </div>
                                        </CardContent>
                                    </Card>

                                </div>
                            </TabsContent>

                            <TabsContent value="planner">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Weekly Meal Planner</CardTitle>
                                        <CardDescription>Drag and drop meals to plan your week.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[400px] flex items-center justify-center text-slate-400">
                                        <p>Calendar View Coming Soon...</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="scanner">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>OCR Ingredient Scanner</CardTitle>
                                        <CardDescription>Check if a product is vegan instantly.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <div
                                            className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors w-full max-w-md cursor-pointer"
                                            onClick={() => setIsUploading(true)}
                                        >
                                            <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                                            <h3 className="text-lg font-medium text-slate-900">Upload Nutrition Label</h3>
                                            <p className="text-sm text-slate-500 mt-2">Drag & drop or click to select</p>
                                        </div>
                                        {isUploading && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Analyzing... (Mock Analysis)
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </motion.div>

            {/* Floating Action Button (Optional "Antigravity" element) */}
            <motion.button
                className="fixed bottom-8 right-8 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
            >
                <Leaf className="h-6 w-6" />
            </motion.button>
        </div>
    )
}
