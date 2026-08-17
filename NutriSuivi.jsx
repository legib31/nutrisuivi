import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ResponsiveContainer, Tooltip, Cell, CartesianGrid,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Base d'aliments — valeurs pour 100 g (ordres de grandeur CIQUAL).  */
/* ------------------------------------------------------------------ */
const FOODS = [
  { id: "skyr", nom: "Skyr nature", grp: "laitier", kcal: 63, p: 11, c: 4, f: 0.2 },
  { id: "fromageblanc0", nom: "Fromage blanc 0 %", grp: "laitier", kcal: 46, p: 8, c: 4, f: 0.2 },
  { id: "pepites", nom: "Pépites de chocolat", grp: "extra", kcal: 500, p: 5, c: 60, f: 30 },
  { id: "fibres", nom: "Son d'avoine (fibres)", grp: "cereale", kcal: 350, p: 17, c: 50, f: 7 },
  { id: "cereal", nom: "Céréales sans sucre", grp: "cereale", kcal: 380, p: 10, c: 70, f: 6 },
  { id: "avoine", nom: "Flocons d'avoine", grp: "cereale", kcal: 370, p: 13, c: 60, f: 7 },
  { id: "oeuf", nom: "Œuf (≈50 g/pièce)", grp: "proteine", kcal: 145, p: 13, c: 0.5, f: 10 },
  { id: "pates_crues", nom: "Pâtes crues (pesée sèche)", grp: "feculent", kcal: 350, p: 12, c: 70, f: 1.5 },
  { id: "pates_cuites", nom: "Pâtes cuites", grp: "feculent", kcal: 130, p: 5, c: 25, f: 1 },
  { id: "riz_cru", nom: "Riz cru (pesée sèche)", grp: "feculent", kcal: 350, p: 7, c: 78, f: 1 },
  { id: "riz_cuit", nom: "Riz cuit", grp: "feculent", kcal: 130, p: 2.7, c: 28, f: 0.3 },
  { id: "pdt_crue", nom: "Pomme de terre crue", grp: "feculent", kcal: 80, p: 2, c: 17, f: 0.1 },
  { id: "pdt_rissolee", nom: "Pdt rissolées (avec MG)", grp: "feculent", kcal: 155, p: 2.5, c: 20, f: 7 },
  { id: "baguette", nom: "Baguette / pain blanc", grp: "feculent", kcal: 270, p: 9, c: 55, f: 1 },
  { id: "sauce_bolo", nom: "Sauce bolognaise maison", grp: "proteine", kcal: 120, p: 9, c: 6, f: 6 },
  { id: "viande_hachee", nom: "Viande hachée (mi-maigre)", grp: "proteine", kcal: 220, p: 20, c: 0, f: 15 },
  { id: "medaillon", nom: "Médaillon ardennais", grp: "proteine", kcal: 280, p: 15, c: 2, f: 24 },
  { id: "boulette", nom: "Boulette", grp: "proteine", kcal: 250, p: 15, c: 8, f: 18 },
  { id: "steak", nom: "Steak de bœuf", grp: "proteine", kcal: 180, p: 26, c: 0, f: 8 },
  { id: "poulet", nom: "Blanc de poulet", grp: "proteine", kcal: 120, p: 23, c: 0, f: 2.5 },
  { id: "brocoli", nom: "Brocolis", grp: "legume", kcal: 34, p: 2.8, c: 4, f: 0.4 },
  { id: "concombre", nom: "Concombre", grp: "legume", kcal: 15, p: 0.7, c: 2, f: 0.1 },
  { id: "tomate", nom: "Tomate", grp: "legume", kcal: 18, p: 0.9, c: 3, f: 0.2 },
  { id: "epinard", nom: "Épinards", grp: "legume", kcal: 23, p: 2.9, c: 1.5, f: 0.4 },
  { id: "crudites", nom: "Crudités mélangées", grp: "legume", kcal: 25, p: 1.2, c: 4, f: 0.2 },
  { id: "creme", nom: "Crème épaisse", grp: "extra", kcal: 300, p: 2.4, c: 3, f: 30 },
  { id: "creme_all", nom: "Crème allégée", grp: "extra", kcal: 160, p: 3, c: 4, f: 15 },
  { id: "huile", nom: "Huile", grp: "extra", kcal: 900, p: 0, c: 0, f: 100 },
  { id: "beurre", nom: "Beurre", grp: "extra", kcal: 750, p: 0.7, c: 0.7, f: 83 },
  { id: "amandes", nom: "Amandes", grp: "extra", kcal: 600, p: 21, c: 4, f: 54 },
  { id: "pomme", nom: "Pomme", grp: "fruit", kcal: 52, p: 0.3, c: 12, f: 0.2 },
  { id: "banane", nom: "Banane", grp: "fruit", kcal: 90, p: 1.1, c: 20, f: 0.3 },
  { id: "orange", nom: "Orange", grp: "fruit", kcal: 47, p: 0.9, c: 9, f: 0.1 },
  { id: "fruitsrouges", nom: "Fruits rouges", grp: "fruit", kcal: 45, p: 1, c: 8, f: 0.4 },

  /* --- Fruits --- */
  { id: "fraise", nom: "Fraises", grp: "fruit", kcal: 33, p: 0.7, c: 6, f: 0.3 },
  { id: "framboise", nom: "Framboises", grp: "fruit", kcal: 52, p: 1.2, c: 5, f: 0.7 },
  { id: "myrtille", nom: "Myrtilles", grp: "fruit", kcal: 57, p: 0.7, c: 12, f: 0.3 },
  { id: "raisin", nom: "Raisin", grp: "fruit", kcal: 69, p: 0.7, c: 16, f: 0.2 },
  { id: "poire", nom: "Poire", grp: "fruit", kcal: 57, p: 0.4, c: 12, f: 0.1 },
  { id: "peche", nom: "Pêche", grp: "fruit", kcal: 39, p: 0.9, c: 8, f: 0.3 },
  { id: "abricot", nom: "Abricot", grp: "fruit", kcal: 48, p: 1.4, c: 9, f: 0.4 },
  { id: "kiwi", nom: "Kiwi", grp: "fruit", kcal: 61, p: 1.1, c: 10, f: 0.5 },
  { id: "ananas", nom: "Ananas", grp: "fruit", kcal: 50, p: 0.5, c: 12, f: 0.1 },
  { id: "mangue", nom: "Mangue", grp: "fruit", kcal: 60, p: 0.8, c: 13, f: 0.4 },
  { id: "melon", nom: "Melon", grp: "fruit", kcal: 34, p: 0.8, c: 8, f: 0.2 },
  { id: "pasteque", nom: "Pastèque", grp: "fruit", kcal: 30, p: 0.6, c: 7, f: 0.2 },
  { id: "cerise", nom: "Cerises", grp: "fruit", kcal: 63, p: 1, c: 14, f: 0.2 },
  { id: "prune", nom: "Prune", grp: "fruit", kcal: 46, p: 0.7, c: 10, f: 0.3 },
  { id: "clementine", nom: "Clémentine", grp: "fruit", kcal: 47, p: 0.9, c: 11, f: 0.2 },
  { id: "citron", nom: "Citron", grp: "fruit", kcal: 29, p: 1.1, c: 9, f: 0.3 },
  { id: "pamplemousse", nom: "Pamplemousse", grp: "fruit", kcal: 42, p: 0.8, c: 9, f: 0.1 },
  { id: "figue", nom: "Figue", grp: "fruit", kcal: 74, p: 0.8, c: 16, f: 0.3 },
  { id: "datte", nom: "Dattes", grp: "fruit", kcal: 282, p: 2.5, c: 68, f: 0.4 },
  { id: "avocat", nom: "Avocat", grp: "fruit", kcal: 160, p: 2, c: 2, f: 15 },

  /* --- Légumes --- */
  { id: "carotte", nom: "Carotte", grp: "legume", kcal: 41, p: 0.9, c: 7, f: 0.2 },
  { id: "courgette", nom: "Courgette", grp: "legume", kcal: 17, p: 1.2, c: 3, f: 0.3 },
  { id: "poivron", nom: "Poivron", grp: "legume", kcal: 26, p: 1, c: 5, f: 0.3 },
  { id: "choufleur", nom: "Chou-fleur", grp: "legume", kcal: 25, p: 1.9, c: 3, f: 0.3 },
  { id: "haricotvert", nom: "Haricots verts", grp: "legume", kcal: 31, p: 1.8, c: 5, f: 0.2 },
  { id: "petitpois", nom: "Petits pois", grp: "legume", kcal: 81, p: 5, c: 14, f: 0.4 },
  { id: "champignon", nom: "Champignons", grp: "legume", kcal: 22, p: 3, c: 1, f: 0.3 },
  { id: "oignon", nom: "Oignon", grp: "legume", kcal: 40, p: 1.1, c: 9, f: 0.1 },
  { id: "salade", nom: "Salade / laitue", grp: "legume", kcal: 15, p: 1.4, c: 1.5, f: 0.2 },
  { id: "poireau", nom: "Poireau", grp: "legume", kcal: 61, p: 1.5, c: 14, f: 0.3 },
  { id: "aubergine", nom: "Aubergine", grp: "legume", kcal: 25, p: 1, c: 6, f: 0.2 },
  { id: "potiron", nom: "Potiron / courge", grp: "legume", kcal: 26, p: 1, c: 6, f: 0.1 },
  { id: "betterave", nom: "Betterave", grp: "legume", kcal: 43, p: 1.6, c: 10, f: 0.2 },
  { id: "celeri", nom: "Céleri", grp: "legume", kcal: 16, p: 0.7, c: 3, f: 0.2 },
  { id: "mais", nom: "Maïs", grp: "legume", kcal: 86, p: 3.3, c: 19, f: 1.2 },
  { id: "asperge", nom: "Asperges", grp: "legume", kcal: 20, p: 2.2, c: 4, f: 0.1 },
  { id: "chou", nom: "Chou", grp: "legume", kcal: 25, p: 1.3, c: 6, f: 0.1 },

  /* --- Féculents & légumineuses --- */
  { id: "patate_douce", nom: "Patate douce", grp: "feculent", kcal: 86, p: 1.6, c: 20, f: 0.1 },
  { id: "quinoa_cuit", nom: "Quinoa cuit", grp: "feculent", kcal: 120, p: 4.4, c: 21, f: 1.9 },
  { id: "couscous_cuit", nom: "Couscous / semoule cuit", grp: "feculent", kcal: 112, p: 3.8, c: 23, f: 0.2 },
  { id: "boulgour_cuit", nom: "Boulgour cuit", grp: "feculent", kcal: 83, p: 3, c: 18, f: 0.2 },
  { id: "riz_complet_cuit", nom: "Riz complet cuit", grp: "feculent", kcal: 111, p: 2.6, c: 23, f: 0.9 },
  { id: "pain_complet", nom: "Pain complet", grp: "feculent", kcal: 250, p: 9, c: 45, f: 3 },
  { id: "pain_gris", nom: "Pain gris", grp: "feculent", kcal: 240, p: 8, c: 44, f: 2 },
  { id: "pain_de_mie", nom: "Pain de mie", grp: "feculent", kcal: 265, p: 8, c: 49, f: 4 },
  { id: "biscotte", nom: "Biscotte", grp: "feculent", kcal: 380, p: 11, c: 73, f: 6 },
  { id: "frites", nom: "Frites", grp: "feculent", kcal: 312, p: 3.4, c: 41, f: 15 },
  { id: "puree", nom: "Purée de pdt", grp: "feculent", kcal: 90, p: 2, c: 15, f: 2.5 },
  { id: "gnocchi", nom: "Gnocchi", grp: "feculent", kcal: 130, p: 3, c: 27, f: 1 },
  { id: "lentilles_cuites", nom: "Lentilles cuites", grp: "feculent", kcal: 116, p: 9, c: 20, f: 0.4 },
  { id: "pois_chiches", nom: "Pois chiches cuits", grp: "feculent", kcal: 164, p: 9, c: 27, f: 2.6 },
  { id: "haricots_rouges", nom: "Haricots rouges cuits", grp: "feculent", kcal: 127, p: 9, c: 22, f: 0.5 },

  /* --- Laitier & fromages --- */
  { id: "lait_demi", nom: "Lait demi-écrémé", grp: "laitier", kcal: 46, p: 3.3, c: 5, f: 1.6 },
  { id: "lait_entier", nom: "Lait entier", grp: "laitier", kcal: 64, p: 3.2, c: 5, f: 3.6 },
  { id: "lait_ecreme", nom: "Lait écrémé", grp: "laitier", kcal: 35, p: 3.4, c: 5, f: 0.1 },
  { id: "yaourt_nature", nom: "Yaourt nature", grp: "laitier", kcal: 61, p: 3.5, c: 5, f: 3.3 },
  { id: "yaourt_grec", nom: "Yaourt grec", grp: "laitier", kcal: 97, p: 9, c: 4, f: 5 },
  { id: "cottage", nom: "Cottage cheese", grp: "laitier", kcal: 98, p: 11, c: 3, f: 4 },
  { id: "ricotta", nom: "Ricotta", grp: "laitier", kcal: 150, p: 11, c: 3, f: 10 },
  { id: "comte", nom: "Comté", grp: "laitier", kcal: 410, p: 27, c: 0, f: 33 },
  { id: "gouda", nom: "Gouda", grp: "laitier", kcal: 356, p: 25, c: 2, f: 27 },
  { id: "emmental", nom: "Emmental", grp: "laitier", kcal: 380, p: 28, c: 0, f: 29 },
  { id: "mozzarella", nom: "Mozzarella", grp: "laitier", kcal: 250, p: 18, c: 3, f: 18 },
  { id: "feta", nom: "Feta", grp: "laitier", kcal: 264, p: 14, c: 4, f: 21 },
  { id: "chevre", nom: "Fromage de chèvre", grp: "laitier", kcal: 290, p: 19, c: 2, f: 23 },
  { id: "parmesan", nom: "Parmesan", grp: "laitier", kcal: 400, p: 36, c: 0, f: 29 },
  { id: "camembert", nom: "Camembert", grp: "laitier", kcal: 300, p: 20, c: 0.5, f: 24 },
  { id: "cheddar", nom: "Cheddar", grp: "laitier", kcal: 400, p: 25, c: 1, f: 33 },

  /* --- Viandes & œufs --- */
  { id: "blanc_oeuf", nom: "Blanc d'œuf", grp: "proteine", kcal: 52, p: 11, c: 0.7, f: 0.2 },
  { id: "cuisse_poulet", nom: "Cuisse de poulet", grp: "proteine", kcal: 180, p: 18, c: 0, f: 12 },
  { id: "dinde", nom: "Escalope de dinde", grp: "proteine", kcal: 110, p: 22, c: 0, f: 2 },
  { id: "boeuf_hache5", nom: "Bœuf haché 5 %", grp: "proteine", kcal: 130, p: 21, c: 0, f: 5 },
  { id: "porc_filet", nom: "Filet de porc", grp: "proteine", kcal: 145, p: 21, c: 0, f: 7 },
  { id: "cote_porc", nom: "Côte de porc", grp: "proteine", kcal: 240, p: 18, c: 0, f: 18 },
  { id: "jambon_blanc", nom: "Jambon blanc", grp: "proteine", kcal: 110, p: 18, c: 1, f: 4 },
  { id: "jambon_cru", nom: "Jambon cru", grp: "proteine", kcal: 240, p: 25, c: 0.5, f: 15 },
  { id: "lardons", nom: "Lardons", grp: "proteine", kcal: 300, p: 15, c: 0.5, f: 27 },
  { id: "saucisse", nom: "Saucisse", grp: "proteine", kcal: 300, p: 13, c: 2, f: 27 },
  { id: "salami", nom: "Salami", grp: "proteine", kcal: 380, p: 22, c: 1, f: 32 },
  { id: "veau", nom: "Veau", grp: "proteine", kcal: 160, p: 21, c: 0, f: 8 },
  { id: "americain", nom: "Américain préparé", grp: "proteine", kcal: 250, p: 14, c: 3, f: 20 },

  /* --- Poisson --- */
  { id: "saumon", nom: "Saumon", grp: "poisson", kcal: 200, p: 20, c: 0, f: 13 },
  { id: "saumon_fume", nom: "Saumon fumé", grp: "poisson", kcal: 180, p: 22, c: 0, f: 10 },
  { id: "thon_frais", nom: "Thon frais", grp: "poisson", kcal: 130, p: 23, c: 0, f: 4 },
  { id: "thon_boite", nom: "Thon en boîte (naturel)", grp: "poisson", kcal: 116, p: 26, c: 0, f: 1 },
  { id: "cabillaud", nom: "Cabillaud", grp: "poisson", kcal: 82, p: 18, c: 0, f: 0.7 },
  { id: "colin", nom: "Colin / merlu", grp: "poisson", kcal: 90, p: 18, c: 0, f: 2 },
  { id: "truite", nom: "Truite", grp: "poisson", kcal: 140, p: 20, c: 0, f: 6 },
  { id: "crevettes", nom: "Crevettes", grp: "poisson", kcal: 99, p: 21, c: 0.2, f: 1.7 },
  { id: "moules", nom: "Moules", grp: "poisson", kcal: 86, p: 12, c: 4, f: 2 },
  { id: "sardine", nom: "Sardine", grp: "poisson", kcal: 180, p: 21, c: 0, f: 10 },
  { id: "surimi", nom: "Surimi", grp: "poisson", kcal: 95, p: 8, c: 12, f: 1 },

  /* --- Céréales petit-déj --- */
  { id: "muesli", nom: "Muesli", grp: "cereale", kcal: 360, p: 10, c: 60, f: 8 },
  { id: "corn_flakes", nom: "Corn flakes", grp: "cereale", kcal: 380, p: 7, c: 84, f: 1 },

  /* --- Noix, graines, matières grasses --- */
  { id: "noix", nom: "Noix", grp: "extra", kcal: 650, p: 15, c: 7, f: 65 },
  { id: "noisette", nom: "Noisettes", grp: "extra", kcal: 630, p: 15, c: 7, f: 61 },
  { id: "cacahuete", nom: "Cacahuètes", grp: "extra", kcal: 570, p: 26, c: 10, f: 49 },
  { id: "cajou", nom: "Noix de cajou", grp: "extra", kcal: 550, p: 18, c: 30, f: 44 },
  { id: "beurre_cacahuete", nom: "Beurre de cacahuète", grp: "extra", kcal: 590, p: 25, c: 20, f: 50 },
  { id: "olive", nom: "Olives", grp: "extra", kcal: 150, p: 1, c: 6, f: 15 },
  { id: "huile_olive", nom: "Huile d'olive", grp: "extra", kcal: 900, p: 0, c: 0, f: 100 },
  { id: "margarine", nom: "Margarine", grp: "extra", kcal: 720, p: 0.2, c: 0.7, f: 80 },
  { id: "mayonnaise", nom: "Mayonnaise", grp: "extra", kcal: 680, p: 1, c: 2, f: 75 },
  { id: "ketchup", nom: "Ketchup", grp: "extra", kcal: 100, p: 1.2, c: 24, f: 0.1 },
  { id: "moutarde", nom: "Moutarde", grp: "extra", kcal: 150, p: 8, c: 5, f: 10 },
  { id: "pesto", nom: "Pesto", grp: "extra", kcal: 450, p: 5, c: 6, f: 45 },
  { id: "sauce_tomate", nom: "Sauce tomate", grp: "extra", kcal: 35, p: 1.5, c: 6, f: 0.5 },
  { id: "bechamel", nom: "Béchamel", grp: "extra", kcal: 150, p: 4, c: 10, f: 10 },

  /* --- Sucré / snacks --- */
  { id: "miel", nom: "Miel", grp: "sucre", kcal: 304, p: 0.3, c: 82, f: 0 },
  { id: "confiture", nom: "Confiture", grp: "sucre", kcal: 260, p: 0.5, c: 65, f: 0 },
  { id: "pate_choco", nom: "Pâte à tartiner choco", grp: "sucre", kcal: 540, p: 6, c: 57, f: 31 },
  { id: "sucre", nom: "Sucre", grp: "sucre", kcal: 400, p: 0, c: 100, f: 0 },
  { id: "chocolat_noir", nom: "Chocolat noir", grp: "sucre", kcal: 550, p: 7, c: 46, f: 38 },
  { id: "chocolat_lait", nom: "Chocolat au lait", grp: "sucre", kcal: 535, p: 7, c: 58, f: 30 },
  { id: "biscuit_sec", nom: "Biscuit sec", grp: "sucre", kcal: 450, p: 7, c: 70, f: 15 },
  { id: "speculoos", nom: "Spéculoos", grp: "sucre", kcal: 470, p: 5, c: 72, f: 18 },
  { id: "gaufre", nom: "Gaufre", grp: "sucre", kcal: 380, p: 7, c: 50, f: 17 },
  { id: "crepe", nom: "Crêpe", grp: "sucre", kcal: 220, p: 6, c: 30, f: 8 },
  { id: "chips", nom: "Chips", grp: "sucre", kcal: 540, p: 6, c: 50, f: 35 },
  { id: "cookie", nom: "Cookie", grp: "sucre", kcal: 480, p: 5, c: 64, f: 22 },
  { id: "croissant", nom: "Croissant", grp: "sucre", kcal: 400, p: 8, c: 45, f: 21 },
  { id: "pain_choco", nom: "Pain au chocolat", grp: "sucre", kcal: 410, p: 8, c: 47, f: 22 },
  { id: "barre_cereale", nom: "Barre de céréales", grp: "sucre", kcal: 400, p: 6, c: 70, f: 10 },
  { id: "glace_vanille", nom: "Glace vanille", grp: "sucre", kcal: 200, p: 3, c: 24, f: 10 },

  /* --- Plats préparés --- */
  { id: "lasagne", nom: "Lasagne", grp: "plat", kcal: 150, p: 8, c: 14, f: 7 },
  { id: "quiche", nom: "Quiche", grp: "plat", kcal: 260, p: 9, c: 20, f: 16 },
  { id: "croque_monsieur", nom: "Croque-monsieur", grp: "plat", kcal: 280, p: 15, c: 22, f: 15 },
  { id: "vol_au_vent", nom: "Vol-au-vent", grp: "plat", kcal: 150, p: 9, c: 8, f: 9 },
  { id: "carbonnade", nom: "Carbonnade flamande", grp: "plat", kcal: 130, p: 12, c: 6, f: 6 },
  { id: "gratin_dauphinois", nom: "Gratin dauphinois", grp: "plat", kcal: 160, p: 3, c: 15, f: 10 },
  { id: "hachis", nom: "Hachis parmentier", grp: "plat", kcal: 120, p: 6, c: 12, f: 5 },
  { id: "pizza", nom: "Pizza margherita", grp: "plat", kcal: 260, p: 11, c: 30, f: 10 },
  { id: "croquette_fromage", nom: "Croquette au fromage", grp: "plat", kcal: 250, p: 7, c: 20, f: 15 },
  { id: "soupe_legumes", nom: "Soupe de légumes", grp: "plat", kcal: 40, p: 1.5, c: 6, f: 1 },
  { id: "fricadelle", nom: "Fricadelle", grp: "plat", kcal: 290, p: 11, c: 15, f: 21 },

  /* --- Boissons --- */
  { id: "jus_orange", nom: "Jus d'orange", grp: "boisson", kcal: 45, p: 0.7, c: 10, f: 0.1 },
  { id: "jus_pomme", nom: "Jus de pomme", grp: "boisson", kcal: 46, p: 0.1, c: 11, f: 0.1 },
  { id: "coca", nom: "Coca / soda", grp: "boisson", kcal: 42, p: 0, c: 11, f: 0 },
  { id: "coca_zero", nom: "Soda light / zéro", grp: "boisson", kcal: 0.3, p: 0, c: 0, f: 0 },
  { id: "biere", nom: "Bière (pils)", grp: "boisson", kcal: 43, p: 0.5, c: 3.6, f: 0 },
  { id: "vin_rouge", nom: "Vin rouge", grp: "boisson", kcal: 85, p: 0.1, c: 2.6, f: 0 },
  { id: "vin_blanc", nom: "Vin blanc", grp: "boisson", kcal: 82, p: 0.1, c: 2.6, f: 0 },
  { id: "smoothie", nom: "Smoothie", grp: "boisson", kcal: 55, p: 0.8, c: 13, f: 0.2 },
  { id: "cafe_noir", nom: "Café noir", grp: "boisson", kcal: 2, p: 0.1, c: 0, f: 0 },

  /* --- Complément fruits --- */
  { id: "nectarine", nom: "Nectarine", grp: "fruit", kcal: 44, p: 1.1, c: 11, f: 0.3 },
  { id: "mure", nom: "Mûres", grp: "fruit", kcal: 43, p: 1.4, c: 10, f: 0.5 },
  { id: "groseille", nom: "Groseilles", grp: "fruit", kcal: 56, p: 1.4, c: 14, f: 0.2 },
  { id: "kaki", nom: "Kaki", grp: "fruit", kcal: 70, p: 0.6, c: 18, f: 0.2 },
  { id: "papaye", nom: "Papaye", grp: "fruit", kcal: 43, p: 0.5, c: 11, f: 0.3 },
  { id: "litchi", nom: "Litchi", grp: "fruit", kcal: 66, p: 0.8, c: 17, f: 0.4 },
  { id: "grenade", nom: "Grenade", grp: "fruit", kcal: 83, p: 1.7, c: 17, f: 1.2 },
  { id: "raisin_sec", nom: "Raisins secs", grp: "fruit", kcal: 300, p: 3, c: 79, f: 0.5 },
  { id: "pruneau", nom: "Pruneaux", grp: "fruit", kcal: 240, p: 2, c: 64, f: 0.4 },
  { id: "compote", nom: "Compote de pomme (nature)", grp: "fruit", kcal: 45, p: 0.3, c: 11, f: 0.1 },

  /* --- Complément légumes --- */
  { id: "radis", nom: "Radis", grp: "legume", kcal: 16, p: 0.7, c: 3, f: 0.1 },
  { id: "navet", nom: "Navet", grp: "legume", kcal: 28, p: 0.9, c: 6, f: 0.1 },
  { id: "fenouil", nom: "Fenouil", grp: "legume", kcal: 31, p: 1.2, c: 7, f: 0.2 },
  { id: "artichaut", nom: "Artichaut", grp: "legume", kcal: 47, p: 3.3, c: 11, f: 0.2 },
  { id: "chou_bruxelles", nom: "Choux de Bruxelles", grp: "legume", kcal: 43, p: 3.4, c: 9, f: 0.3 },
  { id: "chou_rouge", nom: "Chou rouge", grp: "legume", kcal: 31, p: 1.4, c: 7, f: 0.2 },
  { id: "panais", nom: "Panais", grp: "legume", kcal: 75, p: 1.2, c: 18, f: 0.3 },
  { id: "butternut", nom: "Courge butternut", grp: "legume", kcal: 45, p: 1, c: 10, f: 0.1 },
  { id: "roquette", nom: "Roquette", grp: "legume", kcal: 25, p: 2.6, c: 3, f: 0.7 },
  { id: "mache", nom: "Mâche", grp: "legume", kcal: 21, p: 2, c: 3, f: 0.4 },
  { id: "cornichon", nom: "Cornichons", grp: "legume", kcal: 12, p: 0.5, c: 2, f: 0.1 },
  { id: "ratatouille", nom: "Ratatouille", grp: "legume", kcal: 60, p: 1.5, c: 7, f: 3 },

  /* --- Complément féculents & légumineuses --- */
  { id: "pdt_vapeur", nom: "Pdt vapeur / bouillies", grp: "feculent", kcal: 80, p: 2, c: 17, f: 0.1 },
  { id: "pain_pita", nom: "Pain pita", grp: "feculent", kcal: 275, p: 9, c: 55, f: 1.5 },
  { id: "tortilla", nom: "Wrap / tortilla", grp: "feculent", kcal: 310, p: 8, c: 50, f: 8 },
  { id: "pain_epeautre", nom: "Pain d'épeautre", grp: "feculent", kcal: 240, p: 9, c: 44, f: 2 },
  { id: "pain_multi", nom: "Pain multicéréales", grp: "feculent", kcal: 250, p: 9, c: 43, f: 4 },
  { id: "crackers", nom: "Crackers", grp: "feculent", kcal: 430, p: 9, c: 68, f: 13 },
  { id: "pates_completes", nom: "Pâtes complètes cuites", grp: "feculent", kcal: 124, p: 5, c: 25, f: 0.9 },
  { id: "nouilles", nom: "Nouilles chinoises", grp: "feculent", kcal: 138, p: 5, c: 25, f: 2 },
  { id: "polenta", nom: "Polenta cuite", grp: "feculent", kcal: 85, p: 2, c: 18, f: 0.3 },
  { id: "sarrasin", nom: "Sarrasin cuit", grp: "feculent", kcal: 92, p: 3.4, c: 20, f: 0.6 },
  { id: "lentilles_corail", nom: "Lentilles corail cuites", grp: "feculent", kcal: 116, p: 8, c: 20, f: 0.4 },
  { id: "edamame", nom: "Edamame", grp: "feculent", kcal: 121, p: 12, c: 9, f: 5 },
  { id: "feves", nom: "Fèves cuites", grp: "feculent", kcal: 88, p: 8, c: 12, f: 0.6 },

  /* --- Protéines végétales --- */
  { id: "tofu", nom: "Tofu nature", grp: "proteine", kcal: 120, p: 12, c: 2, f: 7 },
  { id: "tempeh", nom: "Tempeh", grp: "proteine", kcal: 190, p: 19, c: 9, f: 11 },
  { id: "seitan", nom: "Seitan", grp: "proteine", kcal: 120, p: 21, c: 4, f: 2 },
  { id: "houmous", nom: "Houmous", grp: "proteine", kcal: 230, p: 7, c: 15, f: 17 },
  { id: "steak_vegetal", nom: "Steak végétal", grp: "proteine", kcal: 180, p: 17, c: 6, f: 9 },

  /* --- Complément viandes & charcuterie --- */
  { id: "dinde_hachee", nom: "Dinde hachée", grp: "proteine", kcal: 150, p: 20, c: 0, f: 8 },
  { id: "canard", nom: "Magret de canard", grp: "proteine", kcal: 200, p: 19, c: 0, f: 13 },
  { id: "roti_porc", nom: "Rôti de porc", grp: "proteine", kcal: 210, p: 25, c: 0, f: 12 },
  { id: "gigot_agneau", nom: "Gigot d'agneau", grp: "proteine", kcal: 230, p: 18, c: 0, f: 17 },
  { id: "bacon", nom: "Bacon", grp: "proteine", kcal: 540, p: 12, c: 1, f: 53 },
  { id: "pate", nom: "Pâté", grp: "proteine", kcal: 320, p: 13, c: 2, f: 29 },
  { id: "cervelas", nom: "Cervelas", grp: "proteine", kcal: 280, p: 12, c: 2, f: 25 },
  { id: "chipolata", nom: "Chipolata", grp: "proteine", kcal: 290, p: 13, c: 1, f: 26 },
  { id: "nuggets", nom: "Nuggets de poulet", grp: "proteine", kcal: 260, p: 14, c: 15, f: 16 },
  { id: "cordon_bleu", nom: "Cordon bleu", grp: "proteine", kcal: 250, p: 15, c: 15, f: 14 },
  { id: "omelette", nom: "Omelette", grp: "proteine", kcal: 155, p: 11, c: 1, f: 12 },

  /* --- Complément poisson & fruits de mer --- */
  { id: "thon_huile", nom: "Thon à l'huile", grp: "poisson", kcal: 190, p: 25, c: 0, f: 10 },
  { id: "hareng", nom: "Hareng", grp: "poisson", kcal: 210, p: 18, c: 0, f: 15 },
  { id: "maquereau", nom: "Maquereau", grp: "poisson", kcal: 205, p: 19, c: 0, f: 14 },
  { id: "anchois", nom: "Anchois", grp: "poisson", kcal: 130, p: 20, c: 0, f: 5 },
  { id: "crabe", nom: "Crabe", grp: "poisson", kcal: 83, p: 18, c: 0, f: 1 },
  { id: "huitre", nom: "Huîtres", grp: "poisson", kcal: 66, p: 7, c: 4, f: 2 },
  { id: "saint_jacques", nom: "Saint-Jacques", grp: "poisson", kcal: 90, p: 17, c: 3, f: 1 },
  { id: "calamar", nom: "Calamar", grp: "poisson", kcal: 92, p: 16, c: 3, f: 1.4 },
  { id: "poisson_pane", nom: "Poisson pané", grp: "poisson", kcal: 200, p: 12, c: 15, f: 10 },
  { id: "dorade", nom: "Dorade", grp: "poisson", kcal: 100, p: 19, c: 0, f: 3 },

  /* --- Complément laitier & fromages --- */
  { id: "lait_amande", nom: "Lait d'amande", grp: "laitier", kcal: 24, p: 0.5, c: 3, f: 1.1 },
  { id: "lait_avoine", nom: "Lait d'avoine", grp: "laitier", kcal: 46, p: 0.8, c: 7, f: 1.5 },
  { id: "lait_soja", nom: "Lait de soja", grp: "laitier", kcal: 42, p: 3.3, c: 1.6, f: 1.8 },
  { id: "yaourt_soja", nom: "Yaourt de soja", grp: "laitier", kcal: 55, p: 4, c: 4, f: 2 },
  { id: "petit_suisse", nom: "Petit-suisse", grp: "laitier", kcal: 90, p: 8, c: 4, f: 5 },
  { id: "mascarpone", nom: "Mascarpone", grp: "laitier", kcal: 355, p: 4, c: 4, f: 37 },
  { id: "raclette", nom: "Raclette", grp: "laitier", kcal: 350, p: 23, c: 0.5, f: 28 },
  { id: "bleu", nom: "Bleu / roquefort", grp: "laitier", kcal: 353, p: 21, c: 2, f: 29 },
  { id: "reblochon", nom: "Reblochon", grp: "laitier", kcal: 330, p: 20, c: 0, f: 27 },
  { id: "gruyere", nom: "Gruyère", grp: "laitier", kcal: 413, p: 30, c: 0, f: 33 },
  { id: "burrata", nom: "Burrata", grp: "laitier", kcal: 280, p: 17, c: 3, f: 23 },

  /* --- Complément noix, graines, matières grasses --- */
  { id: "noix_pecan", nom: "Noix de pécan", grp: "extra", kcal: 690, p: 9, c: 14, f: 72 },
  { id: "noix_bresil", nom: "Noix du Brésil", grp: "extra", kcal: 660, p: 14, c: 12, f: 66 },
  { id: "pignon", nom: "Pignons de pin", grp: "extra", kcal: 670, p: 14, c: 13, f: 68 },
  { id: "graines_courge", nom: "Graines de courge", grp: "extra", kcal: 560, p: 30, c: 11, f: 49 },
  { id: "graines_sesame", nom: "Graines de sésame", grp: "extra", kcal: 570, p: 17, c: 23, f: 50 },
  { id: "tahini", nom: "Tahini (purée sésame)", grp: "extra", kcal: 600, p: 17, c: 21, f: 54 },
  { id: "guacamole", nom: "Guacamole", grp: "extra", kcal: 150, p: 2, c: 4, f: 14 },
  { id: "tapenade", nom: "Tapenade", grp: "extra", kcal: 250, p: 3, c: 5, f: 24 },
  { id: "tzatziki", nom: "Tzatziki", grp: "extra", kcal: 90, p: 3, c: 3, f: 7 },
  { id: "creme_coco", nom: "Crème de coco", grp: "extra", kcal: 230, p: 2, c: 3, f: 24 },

  /* --- Complément sucré / snacks --- */
  { id: "gaufre_liege", nom: "Gaufre de Liège", grp: "sucre", kcal: 420, p: 6, c: 50, f: 22 },
  { id: "pain_epices", nom: "Pain d'épices", grp: "sucre", kcal: 340, p: 5, c: 73, f: 3 },
  { id: "brownie", nom: "Brownie", grp: "sucre", kcal: 470, p: 6, c: 55, f: 25 },
  { id: "muffin", nom: "Muffin", grp: "sucre", kcal: 380, p: 5, c: 50, f: 18 },
  { id: "donut", nom: "Donut", grp: "sucre", kcal: 430, p: 5, c: 50, f: 24 },
  { id: "tarte_pomme", nom: "Tarte aux pommes", grp: "sucre", kcal: 240, p: 3, c: 35, f: 10 },
  { id: "tiramisu", nom: "Tiramisu", grp: "sucre", kcal: 260, p: 5, c: 25, f: 16 },
  { id: "mousse_choco", nom: "Mousse au chocolat", grp: "sucre", kcal: 230, p: 4, c: 25, f: 13 },
  { id: "riz_au_lait", nom: "Riz au lait", grp: "sucre", kcal: 130, p: 3, c: 20, f: 4 },
  { id: "popcorn", nom: "Pop-corn", grp: "sucre", kcal: 480, p: 9, c: 60, f: 20 },
  { id: "bretzel", nom: "Bretzel", grp: "sucre", kcal: 380, p: 10, c: 72, f: 4 },
  { id: "bonbon_gelifie", nom: "Bonbons gélifiés", grp: "sucre", kcal: 330, p: 5, c: 80, f: 0 },
  { id: "granola", nom: "Granola", grp: "sucre", kcal: 450, p: 10, c: 60, f: 18 },

  /* --- Complément plats préparés --- */
  { id: "chicons_gratin", nom: "Chicons au gratin", grp: "plat", kcal: 120, p: 6, c: 8, f: 7 },
  { id: "stoemp", nom: "Stoemp", grp: "plat", kcal: 110, p: 3, c: 15, f: 4 },
  { id: "boulets_liege", nom: "Boulets à la liégeoise", grp: "plat", kcal: 200, p: 12, c: 10, f: 12 },
  { id: "waterzooi", nom: "Waterzooi", grp: "plat", kcal: 90, p: 7, c: 5, f: 4 },
  { id: "carbonara", nom: "Pâtes carbonara", grp: "plat", kcal: 160, p: 7, c: 16, f: 7 },
  { id: "risotto", nom: "Risotto", grp: "plat", kcal: 150, p: 3, c: 25, f: 4 },
  { id: "paella", nom: "Paella", grp: "plat", kcal: 150, p: 7, c: 18, f: 5 },
  { id: "chili", nom: "Chili con carne", grp: "plat", kcal: 130, p: 9, c: 12, f: 5 },
  { id: "curry_poulet", nom: "Curry de poulet", grp: "plat", kcal: 120, p: 10, c: 6, f: 6 },
  { id: "sushi", nom: "Sushi", grp: "plat", kcal: 140, p: 4, c: 28, f: 1 },
  { id: "hamburger", nom: "Hamburger", grp: "plat", kcal: 250, p: 12, c: 20, f: 13 },
  { id: "kebab", nom: "Kebab / durum", grp: "plat", kcal: 215, p: 15, c: 15, f: 11 },
  { id: "quiche_lorraine", nom: "Quiche lorraine", grp: "plat", kcal: 280, p: 10, c: 18, f: 18 },
  { id: "soupe_potiron", nom: "Soupe potiron", grp: "plat", kcal: 45, p: 1.5, c: 7, f: 1.5 },

  /* --- Complément boissons --- */
  { id: "eau_gazeuse", nom: "Eau gazeuse", grp: "boisson", kcal: 0, p: 0, c: 0, f: 0 },
  { id: "the_glace", nom: "Thé glacé", grp: "boisson", kcal: 30, p: 0, c: 7, f: 0 },
  { id: "energy_drink", nom: "Boisson énergisante", grp: "boisson", kcal: 45, p: 0, c: 11, f: 0 },
  { id: "jus_multi", nom: "Jus multifruits", grp: "boisson", kcal: 48, p: 0.5, c: 11, f: 0.1 },
  { id: "lait_choco", nom: "Lait chocolaté", grp: "boisson", kcal: 83, p: 3, c: 12, f: 2.5 },
  { id: "chocolat_chaud", nom: "Chocolat chaud", grp: "boisson", kcal: 90, p: 3, c: 13, f: 3 },
  { id: "cappuccino", nom: "Cappuccino", grp: "boisson", kcal: 40, p: 2, c: 4, f: 1.5 },
  { id: "champagne", nom: "Champagne / mousseux", grp: "boisson", kcal: 80, p: 0.2, c: 1.4, f: 0 },
  { id: "cidre", nom: "Cidre", grp: "boisson", kcal: 45, p: 0, c: 5, f: 0 },
  { id: "spiritueux", nom: "Spiritueux (whisky, vodka…)", grp: "boisson", kcal: 240, p: 0, c: 0, f: 0 },

  /* --- Sauces & condiments --- */
  { id: "sauce_andalouse", nom: "Sauce andalouse", grp: "extra", kcal: 350, p: 1, c: 8, f: 35 },
  { id: "sauce_samourai", nom: "Sauce samouraï", grp: "extra", kcal: 400, p: 1, c: 6, f: 42 },
  { id: "sauce_tartare", nom: "Sauce tartare", grp: "extra", kcal: 400, p: 1, c: 4, f: 42 },
  { id: "sauce_bbq", nom: "Sauce barbecue", grp: "extra", kcal: 170, p: 1, c: 40, f: 0.5 },
  { id: "sauce_poivre", nom: "Sauce au poivre", grp: "extra", kcal: 150, p: 2, c: 6, f: 12 },
  { id: "vinaigre", nom: "Vinaigre", grp: "extra", kcal: 20, p: 0, c: 0.5, f: 0 },
  { id: "sauce_soja2", nom: "Sauce soja", grp: "extra", kcal: 60, p: 8, c: 6, f: 0 },
  { id: "whey", nom: "Protéine whey (poudre)", grp: "proteine", kcal: 380, p: 80, c: 7, f: 6 },
  { id: "barre_prot", nom: "Barre protéinée", grp: "sucre", kcal: 350, p: 30, c: 35, f: 10 },
];

const GROUPES = {
  laitier: { label: "Laitier", couleur: "#5B8DEF" },
  cereale: { label: "Céréales", couleur: "#C9973F" },
  feculent: { label: "Féculents", couleur: "#E0912F" },
  proteine: { label: "Protéines / viande", couleur: "#C0562B" },
  poisson: { label: "Poisson", couleur: "#3E9CA8" },
  legume: { label: "Légumes", couleur: "#2C6E49" },
  fruit: { label: "Fruits", couleur: "#9B4DA0" },
  plat: { label: "Plats préparés", couleur: "#B5793C" },
  sucre: { label: "Sucré / snacks", couleur: "#C77DA6" },
  boisson: { label: "Boissons", couleur: "#7AA6C2" },
  extra: { label: "Extras / MG", couleur: "#7C8A80" },
};
const GRP_ORDER = ["laitier", "proteine", "poisson", "feculent", "legume", "fruit", "cereale", "plat", "sucre", "boisson", "extra"];

/* --- Portions courantes (pour doser sans balance). g = poids moyen. --- */
const PORT = {
  pomme: [{ l: "1 moyenne", g: 150 }, { l: "1 petite", g: 130 }, { l: "1 grosse", g: 200 }],
  banane: [{ l: "1 moyenne", g: 120 }, { l: "1 petite", g: 100 }, { l: "1 grande", g: 145 }],
  orange: [{ l: "1", g: 130 }],
  fruitsrouges: [{ l: "1 poignée", g: 80 }, { l: "1 bol", g: 150 }],
  oeuf: [{ l: "1 œuf", g: 50 }, { l: "2 œufs", g: 100 }],
  boulette: [{ l: "1 boulette", g: 65 }, { l: "2 boulettes", g: 130 }],
  steak: [{ l: "1 normal", g: 150 }, { l: "1 fin", g: 120 }, { l: "1 épais", g: 200 }],
  medaillon: [{ l: "1 médaillon", g: 110 }],
  poulet: [{ l: "1 blanc", g: 150 }],
  baguette: [{ l: "1/4", g: 65 }, { l: "1/2", g: 125 }, { l: "morceau", g: 80 }],
  pdt_crue: [{ l: "1 moyenne", g: 150 }, { l: "1 petite", g: 100 }, { l: "1 grosse", g: 200 }],
  pdt_rissolee: [{ l: "portion", g: 150 }, { l: "petite", g: 120 }, { l: "grosse", g: 200 }],
  pates_crues: [{ l: "1 portion", g: 80 }, { l: "grande", g: 100 }],
  riz_cru: [{ l: "1 portion", g: 60 }, { l: "grande", g: 80 }],
  brocoli: [{ l: "1 portion", g: 150 }, { l: "grosse", g: 200 }],
  epinard: [{ l: "1 portion", g: 150 }],
  concombre: [{ l: "qq rondelles", g: 50 }, { l: "1/2", g: 150 }],
  tomate: [{ l: "1", g: 120 }],
  crudites: [{ l: "1 portion", g: 100 }],
  amandes: [{ l: "1 poignée", g: 25 }],
  skyr: [{ l: "1 pot", g: 150 }, { l: "grande portion", g: 225 }],
  fromageblanc0: [{ l: "1 pot", g: 100 }],
  creme: [{ l: "1 c.à.s", g: 15 }, { l: "2 c.à.s", g: 30 }],
  creme_all: [{ l: "1 c.à.s", g: 15 }, { l: "2 c.à.s", g: 30 }],
  huile: [{ l: "1 c.à.s", g: 10 }, { l: "1 c.à.c", g: 5 }],
  beurre: [{ l: "1 noisette", g: 10 }, { l: "1 c.à.s", g: 15 }],
  pepites: [{ l: "1 c.à.s", g: 15 }],
  fibres: [{ l: "1 c.à.s", g: 8 }],
  cereal: [{ l: "1 poignée", g: 30 }, { l: "1 bol", g: 60 }],
  avoine: [{ l: "1 portion", g: 40 }, { l: "grande", g: 60 }],
  fraise: [{ l: "1 poignée", g: 80 }, { l: "1 bol", g: 150 }],
  avocat: [{ l: "1/2", g: 75 }, { l: "1 entier", g: 150 }],
  kiwi: [{ l: "1", g: 75 }],
  peche: [{ l: "1", g: 150 }],
  poire: [{ l: "1", g: 160 }],
  raisin: [{ l: "1 poignée", g: 80 }, { l: "1 grappe", g: 150 }],
  clementine: [{ l: "1", g: 80 }],
  carotte: [{ l: "1", g: 80 }],
  courgette: [{ l: "1/2", g: 150 }, { l: "1", g: 300 }],
  poivron: [{ l: "1/2", g: 75 }, { l: "1", g: 150 }],
  champignon: [{ l: "qq", g: 60 }, { l: "1 portion", g: 100 }],
  mais: [{ l: "1 c.à.s", g: 30 }, { l: "1 portion", g: 80 }],
  patate_douce: [{ l: "1 moyenne", g: 150 }],
  frites: [{ l: "petite", g: 100 }, { l: "moyenne", g: 150 }, { l: "grande", g: 200 }],
  pizza: [{ l: "1 part", g: 120 }, { l: "1/2", g: 200 }, { l: "entière", g: 400 }],
  pain_complet: [{ l: "1 tranche", g: 40 }],
  pain_gris: [{ l: "1 tranche", g: 40 }],
  pain_de_mie: [{ l: "1 tranche", g: 30 }],
  biscotte: [{ l: "1", g: 10 }],
  jambon_blanc: [{ l: "1 tranche", g: 40 }],
  jambon_cru: [{ l: "1 tranche", g: 25 }],
  comte: [{ l: "1 morceau", g: 30 }],
  gouda: [{ l: "1 tranche", g: 20 }],
  mozzarella: [{ l: "1 boule", g: 125 }],
  saumon: [{ l: "1 pavé", g: 130 }],
  cabillaud: [{ l: "1 filet", g: 130 }],
  crevettes: [{ l: "1 poignée", g: 60 }],
  noix: [{ l: "1 poignée", g: 25 }],
  cacahuete: [{ l: "1 poignée", g: 25 }],
  blanc_oeuf: [{ l: "1 blanc", g: 33 }, { l: "2 blancs", g: 66 }],
  yaourt_nature: [{ l: "1 pot", g: 125 }],
  yaourt_grec: [{ l: "1 pot", g: 150 }],
  chocolat_noir: [{ l: "2 carrés", g: 20 }, { l: "1 rangée", g: 40 }],
  chocolat_lait: [{ l: "2 carrés", g: 20 }, { l: "1 rangée", g: 40 }],
  croissant: [{ l: "1", g: 60 }],
  pain_choco: [{ l: "1", g: 70 }],
  crepe: [{ l: "1", g: 60 }],
  gaufre: [{ l: "1", g: 80 }],
  cookie: [{ l: "1", g: 30 }],
  biscuit_sec: [{ l: "1", g: 8 }],
  speculoos: [{ l: "1", g: 6 }],
  croque_monsieur: [{ l: "1", g: 200 }],
  miel: [{ l: "1 c.à.c", g: 8 }, { l: "1 c.à.s", g: 20 }],
  confiture: [{ l: "1 c.à.c", g: 15 }, { l: "1 c.à.s", g: 30 }],
  pate_choco: [{ l: "1 c.à.c", g: 15 }, { l: "1 c.à.s", g: 20 }],
  mayonnaise: [{ l: "1 c.à.s", g: 15 }],
  ketchup: [{ l: "1 c.à.s", g: 15 }],
  jus_orange: [{ l: "1 verre", g: 200 }],
  jus_pomme: [{ l: "1 verre", g: 200 }],
  coca: [{ l: "1 verre", g: 200 }, { l: "1 canette", g: 330 }],
  coca_zero: [{ l: "1 verre", g: 200 }, { l: "1 canette", g: 330 }],
  biere: [{ l: "1 verre", g: 250 }, { l: "1 canette", g: 330 }],
  vin_rouge: [{ l: "1 verre", g: 150 }],
  vin_blanc: [{ l: "1 verre", g: 150 }],
  cafe_noir: [{ l: "1 tasse", g: 100 }],
  lait_demi: [{ l: "1 verre", g: 200 }, { l: "1 bol", g: 250 }],
  lait_entier: [{ l: "1 verre", g: 200 }, { l: "1 bol", g: 250 }],
  tofu: [{ l: "1 portion", g: 120 }],
  houmous: [{ l: "1 c.à.s", g: 25 }, { l: "1 portion", g: 60 }],
  guacamole: [{ l: "1 c.à.s", g: 25 }],
  hamburger: [{ l: "1", g: 200 }],
  kebab: [{ l: "1 durum", g: 350 }],
  sushi: [{ l: "1 pièce", g: 30 }, { l: "6 pièces", g: 180 }],
  gaufre_liege: [{ l: "1", g: 90 }],
  omelette: [{ l: "2 œufs", g: 120 }, { l: "3 œufs", g: 180 }],
  bacon: [{ l: "1 tranche", g: 15 }],
  pain_pita: [{ l: "1", g: 60 }],
  tortilla: [{ l: "1 wrap", g: 60 }],
  raisin_sec: [{ l: "1 poignée", g: 30 }],
  compote: [{ l: "1 pot", g: 100 }],
  petit_suisse: [{ l: "1", g: 60 }],
  lait_amande: [{ l: "1 verre", g: 200 }],
  lait_soja: [{ l: "1 verre", g: 200 }],
  granola: [{ l: "1 portion", g: 45 }],
  cappuccino: [{ l: "1 tasse", g: 150 }],
  chocolat_chaud: [{ l: "1 tasse", g: 200 }],
  champagne: [{ l: "1 coupe", g: 120 }],
  cidre: [{ l: "1 verre", g: 250 }],
  spiritueux: [{ l: "1 dose (4cl)", g: 40 }],
  whey: [{ l: "1 dose", g: 30 }],
  barre_prot: [{ l: "1 barre", g: 50 }],
  noix_pecan: [{ l: "1 poignée", g: 25 }],
  lasagne: [{ l: "1 part", g: 250 }, { l: "grosse part", g: 350 }],
  quiche_lorraine: [{ l: "1 part", g: 150 }],
  paella: [{ l: "1 assiette", g: 300 }],
  chili_carne: [{ l: "1 assiette", g: 300 }],
  couscous_boeuf: [{ l: "1 assiette", g: 350 }],
  spaghetti_bolo: [{ l: "1 assiette", g: 300 }],
  carbonara: [{ l: "1 assiette", g: 300 }],
  risotto: [{ l: "1 assiette", g: 300 }],
  soupe_legumes: [{ l: "1 bol", g: 300 }],
  waterzooi: [{ l: "1 assiette", g: 350 }],
  moules_frites: [{ l: "1 portion", g: 400 }],
  boulettes_sauce: [{ l: "1 portion", g: 250 }],
  vol_au_vent: [{ l: "1 portion", g: 300 }],
  stoemp: [{ l: "1 portion", g: 250 }],
  gratin_dauphinois: [{ l: "1 portion", g: 200 }],
  couscous: [{ l: "1 portion", g: 200 }],
  wrap: [{ l: "1 wrap", g: 180 }],
  salade_cesar: [{ l: "1 portion", g: 250 }],
  poke_bowl: [{ l: "1 bowl", g: 400 }],
  sandwich: [{ l: "1", g: 200 }],
};

/* --- Sports : MET (kcal/h ≈ MET × poids × 1,05). Valeurs de référence. --- */
const SPORTS = [
  { id: "padel", nom: "Padel", met: 7 },
  { id: "tennis", nom: "Tennis", met: 7 },
  { id: "course", nom: "Course à pied (10 km/h)", met: 10 },
  { id: "course_rapide", nom: "Course rapide (12+ km/h)", met: 12.5 },
  { id: "marche", nom: "Marche", met: 3.5 },
  { id: "marche_rapide", nom: "Marche rapide", met: 5 },
  { id: "velo", nom: "Vélo (loisir)", met: 6 },
  { id: "velo_sport", nom: "Vélo (sportif)", met: 10 },
  { id: "natation", nom: "Natation", met: 8 },
  { id: "football", nom: "Football", met: 8 },
  { id: "basket", nom: "Basket", met: 6.5 },
  { id: "muscu", nom: "Musculation", met: 5 },
  { id: "corde", nom: "Corde à sauter", met: 12 },
  { id: "hiit", nom: "HIIT", met: 9 },
  { id: "crossfit", nom: "CrossFit", met: 9 },
  { id: "yoga", nom: "Yoga", met: 3 },
  { id: "pilates", nom: "Pilates", met: 3.5 },
  { id: "rando", nom: "Randonnée", met: 6 },
  { id: "ski", nom: "Ski", met: 7 },
  { id: "squash", nom: "Squash", met: 12 },
  { id: "badminton", nom: "Badminton", met: 5.5 },
  { id: "rameur", nom: "Rameur / aviron", met: 8 },
  { id: "elliptique", nom: "Elliptique", met: 7 },
  { id: "danse", nom: "Danse", met: 5 },
  { id: "boxe", nom: "Boxe", met: 9 },
  { id: "escalade", nom: "Escalade", met: 8 },
  { id: "spinning", nom: "Spinning", met: 8.5 },
  { id: "jardinage", nom: "Jardinage", met: 4 },
];
const kcalPerH = (met, poids) => Math.round(met * poids * 1.05);
function sommeSport(arr) { return (arr || []).reduce((a, e) => a + e.kcal, 0); }
function creditedKcal(date, sportAll, partSport, mode, spreadDays) {
  const frac = (partSport ?? 70) / 100;
  if (mode === "jour") return Math.round(sommeSport(sportAll[date]) * frac);
  // "reparti" (défaut = 7, mais 3 ou 5 possibles)
  const N = Math.max(1, Math.min(14, Number(spreadDays) || 7));
  let s = 0;
  for (let i = 0; i < N; i++) s += sommeSport(sportAll[shiftDate(date, -i)]);
  return Math.round((s * frac) / N);
}
const MEMO = [
  ["1 c. à café rase", "≈ 5 g"],
  ["1 c. à café bombée", "≈ 8 g"],
  ["1 c. à soupe rase", "≈ 15 g"],
  ["1 c. à soupe bombée", "≈ 20 g"],
  ["1 poignée", "≈ 25 g"],
  ["1 verre", "≈ 200 g"],
  ["1 bol", "≈ 250 g"],
];

const REPAS = [
  { id: "petitdej", label: "Déjeuner", h: "matin" },
  { id: "collation", label: "Collation", h: "10h / goûter" },
  { id: "midi", label: "Dîner", h: "midi / école" },
  { id: "soir", label: "Souper", h: "soir" },
];
const MEAL_COLORS = { petitdej: "#E0912F", collation: "#6B4EA8", midi: "#2F80B5", soir: "#C0398C" };
const SPORT_COLOR = "#3E9CA8";
const VERSION = "3.5";
function repasIncomplets(diary, date) {
  const items = diary[date] || [];
  return ["petitdej", "midi", "soir"].filter((id) => !items.some((e) => e.repas === id));
}
async function scheduleMealReminder(h, m) {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator) || typeof window.TimestampTrigger === "undefined") return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const old = await reg.getNotifications({ tag: "repas-soir", includeTriggered: true });
    old.forEach((n) => n.close());
    const t = new Date(); t.setHours(h, m, 0, 0);
    if (t.getTime() <= Date.now()) t.setDate(t.getDate() + 1);
    await reg.showNotification("NutriSuivi", { tag: "repas-soir", body: "As-tu complété tes repas d'aujourd'hui ? 🍽️", showTrigger: new window.TimestampTrigger(t.getTime()), icon: "./icon-192.png" });
  } catch (e) {}
}

const PORTIONS = [
  { grp: "Légumes", txt: "≥ 200 g — la moitié de l'assiette", couleur: "#2C6E49" },
  { grp: "Protéines / viande", txt: "120–150 g cuit", couleur: "#C0562B" },
  { grp: "Féculent cuit", txt: "150 g — la taille du poing", couleur: "#E0912F" },
  { grp: "Pdt crues", txt: "≈ 200 g = 2 moyennes", couleur: "#C9973F" },
  { grp: "Matière grasse", txt: "1 c. à soupe max pour la poêlée", couleur: "#7C8A80" },
];

/* ------------------------------ Utils ------------------------------ */
const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);
const joursCourt = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const joursCal = ["L", "M", "M", "J", "V", "S", "D"];
const moisNom = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const hhmm = (h, m) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
const DEFAULT_RAPPELS = [
  { id: "pesee", label: "Se peser (matin)", h: 7, m: 30, on: false },
  { id: "dejeuner", label: "Logger le déjeuner", h: 8, m: 30, on: false },
  { id: "diner", label: "Logger le dîner", h: 13, m: 0, on: false },
  { id: "souper", label: "Logger le souper", h: 20, m: 0, on: false },
];

function mifflin({ poids, taille, age, sexe }) {
  const base = 10 * poids + 6.25 * taille - 5 * age;
  return Math.round(sexe === "homme" ? base + 5 : base - 161);
}
// Activité quotidienne hors sport (NEAT : métier, mode de vie)
const NEAT = {
  sedentaire: { label: "Sédentaire", desc: "bureau, assis, peu de mouvement", f: 1.2 },
  debout: { label: "Souvent debout", desc: "prof, vendeur, cuisine…", f: 1.35 },
  marche: { label: "Marche beaucoup", desc: "facteur, serveur, infirmier…", f: 1.5 },
  physique: { label: "Travail physique", desc: "BTP, déménageur, agriculteur…", f: 1.65 },
};
// Fréquence de sport structuré (s'ajoute au NEAT)
const SPORT_FREQ = {
  aucun: { label: "Aucun / rare", b: 0 },
  f1_2: { label: "1–2× / semaine", b: 0.1 },
  f3_4: { label: "3–4× / semaine", b: 0.18 },
  f5_6: { label: "5–6× / semaine", b: 0.26 },
  quotidien: { label: "Tous les jours / intense", b: 0.34 },
};
const MOTIVATION = {
  perte: { label: "Perdre du poids", desc: "réduire ta masse grasse en douceur" },
  maintien: { label: "Maintenir mon poids", desc: "stabiliser et suivre l'équilibre" },
  prise: { label: "Prendre du muscle", desc: "surplus léger + protéines" },
};
const REGIME = {
  omnivore: { label: "Omnivore", desc: "tout, sans restriction" },
  flexi: { label: "Flexitarien", desc: "peu de viande, poisson OK" },
  vege: { label: "Végétarien", desc: "sans viande ni poisson" },
  vegan: { label: "Végan", desc: "sans produit animal" },
};
const neatF = (p) => (NEAT[p.neat] || NEAT.debout).f;
const sportB = (p) => (SPORT_FREQ[p.sportFreq] || SPORT_FREQ.f1_2).b;

async function sget(key, fallback) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fallback; }
  catch { return fallback; }
}
async function sset(key, value) { try { await window.storage.set(key, JSON.stringify(value)); } catch {} }

function shiftDate(iso, delta) { const d = new Date(iso); d.setDate(d.getDate() + delta); return d.toISOString().slice(0, 10); }
function jolieDate(iso) { const d = new Date(iso); return d.toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "short" }); }
function sommeMacros(entries) {
  return (entries || []).reduce((a, e) => ({ kcal: a.kcal + e.kcal, p: a.p + e.p, c: a.c + e.c, f: a.f + e.f, fib: a.fib + (e.fib || 0), suc: a.suc + (e.suc || 0) }),
    { kcal: 0, p: 0, c: 0, f: 0, fib: 0, suc: 0 });
}

/* --------- Pré-remplissage de la semaine passée (une seule fois) --- */
function makeEntry(repas, foodId, grams, catalog) {
  const f = catalog.find((x) => x.id === foodId);
  if (!f) return null;
  return {
    id: uid(), repas, foodId, nom: f.nom, grams,
    kcal: (f.kcal * grams) / 100, p: (f.p * grams) / 100, c: (f.c * grams) / 100, f: (f.f * grams) / 100,
  };
}
function seedWeek(catalog) {
  const diary = {};
  const fruits = ["pomme", "banane", "orange"];
  const soirs = [
    [["pates_crues", 90], ["sauce_bolo", 220]],                       // pâtes bolo
    [["steak", 140], ["pdt_rissolee", 160], ["brocoli", 200]],
    [["medaillon", 110], ["pdt_rissolee", 150], ["epinard", 150], ["creme_all", 25]],
    [["poulet", 150], ["riz_cuit", 180], ["concombre", 120]],
    [["pates_crues", 90], ["sauce_bolo", 200], ["tomate", 80]],
    [["boulette", 130], ["pdt_rissolee", 150], ["brocoli", 180]],
    [["steak", 130], ["riz_cuit", 170], ["epinard", 150]],
  ];
  for (let i = 6; i >= 0; i--) {
    const date = shiftDate(todayISO(), -i);
    const idx = 6 - i;
    const day = [];
    // petit-déj
    [["skyr", 225], ["pepites", 20], ["fibres", 20], ["cereal", 20]].forEach(([id, g]) =>
      day.push(makeEntry("petitdej", id, g, catalog)));
    // collation 10h
    day.push(makeEntry("collation", fruits[idx % 3], 130, catalog));
    // midi école
    [["baguette", 80], ["crudites", 100], ["boulette", 100]].forEach(([id, g]) =>
      day.push(makeEntry("midi", id, g, catalog)));
    // soir
    soirs[idx % soirs.length].forEach(([id, g]) => day.push(makeEntry("soir", id, g, catalog)));
    diary[date] = day.filter(Boolean);
  }
  return diary;
}

/* ============================== APP =============================== */
function useIsDesktop() {
  const [d, setD] = useState(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(min-width: 900px)").matches);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 900px)");
    const on = () => setD(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  return d;
}

export default function App() {
  const [tab, setTab] = useState("agenda");
  const [loaded, setLoaded] = useState(false);

  const [profil, setProfil] = useState({
    poids: 86, taille: 183, age: 35, sexe: "homme", neat: "debout", sportFreq: "f1_2", deficit: 500, objectif: 80, crediterSport: false, partSport: 70, sportMode: "jour", sportSpreadDays: 7, rappelRepas: { on: true, h: 21, m: 30 }, waterGoal: 8, motivation: "perte", regime: "omnivore",
  });
  const [poidsLog, setPoidsLog] = useState([]);
  const [diary, setDiary] = useState({});
  const [customFoods, setCustomFoods] = useState([]);
  const [dateSel, setDateSel] = useState(todayISO());
  const [addOpen, setAddOpen] = useState(false);
  const [mealPhotos, setMealPhotos] = useState({});
  const [sport, setSport] = useState({});
  const [customSports, setCustomSports] = useState([]);
  const [sportOpen, setSportOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const isDesktop = useIsDesktop();
  const [addRepas, setAddRepas] = useState("soir");
  const [favMeals, setFavMeals] = useState([]);
  const [editData, setEditData] = useState(null);
  const [water, setWater] = useState({});
  const [showSetup, setShowSetup] = useState(false);
  const [monthReviewSeen, setMonthReviewSeen] = useState("");
  const [sharedFoods, setSharedFoods] = useState([]);
  const [badgesSeen, setBadgesSeen] = useState([]);
  const [lastWeekAI, setLastWeekAI] = useState(null);
  const [habitudes, setHabitudes] = useState([]);

  const allSports = useMemo(() => [...SPORTS, ...customSports], [customSports]);

  // Catalogue = FOODS officiels (CIQUAL) + base communautaire partagée + aliments perso.
  // Dédup : les aliments perso masquent la version partagée qui a le même code.
  const catalog = useMemo(() => {
    const perso = customFoods;
    const persoCodes = new Set(perso.map((f) => f.code).filter(Boolean));
    const shared = sharedFoods.filter((f) => !persoCodes.has(f.code));
    return [...FOODS, ...shared, ...perso];
  }, [customFoods, sharedFoods]);

  // Contribue à la base partagée + garde une copie locale privée si nécessaire.
  async function submitToSharedDB(entry) {
    if (typeof window === "undefined" || !window.NUTRI_SHARED_FOODS) return;
    if (!entry || !entry.nom || !entry.kcal) return;
    const code = entry.code || (entry.source === "encoded" ? `enc_${norm(entry.nom).replace(/\s+/g, "_").slice(0, 40)}` : null);
    if (!code) return;
    try {
      const payload = { code, nom: entry.nom, grp: entry.grp || "plat",
        kcal: entry.kcal, p: entry.p, c: entry.c, f: entry.f,
        fib: entry.fib || 0, suc: entry.suc || 0, source: entry.source || "scan" };
      const saved = await window.NUTRI_SHARED_FOODS.submit(payload);
      if (saved) {
        // Fusionne immédiatement en local pour usage instantané.
        setSharedFoods((s) => {
          const idx = s.findIndex((x) => x.code === code);
          const item = { id: "sh_" + code, code, nom: saved.nom, grp: saved.grp,
            kcal: saved.kcal, p: saved.p, c: saved.c, f: saved.f, fib: saved.fib || 0, suc: saved.suc || 0,
            shared: true, contributions: (idx >= 0 ? (s[idx].contributions || 1) + 1 : 1) };
          if (idx >= 0) { const copy = s.slice(); copy[idx] = item; return copy; }
          return [...s, item];
        });
      }
    } catch {}
  }

  useEffect(() => {
    (async () => {
      const [p, pl, cf, seeded] = await Promise.all([
        sget("nutri:profil", null), sget("nutri:poidslog", []),
        sget("nutri:customfoods", []), sget("nutri:seeded", false),
      ]);
      if (p) setProfil(p);
      setCustomFoods(cf);
      setMealPhotos(await sget("nutri:mealphotos", {}));
      setSport(await sget("nutri:sport", {}));
      setCustomSports(await sget("nutri:customsports", []));
      setFavMeals(await sget("nutri:favmeals", []));
      setWater(await sget("nutri:water", {}));
      let log = pl;
      if (!log.length) log = [{ date: todayISO(), poids: (p || {}).poids || 86 }];
      setPoidsLog(log);
      let d = await sget("nutri:diary", {});
      setDiary(d);
      setShowSetup(!(await sget("nutri:setup_done", false)));
      setShowOnboarding(!(await sget("nutri:onboarding_done", false)));
      setMonthReviewSeen(await sget("nutri:monthReviewSeen", ""));
      setBadgesSeen(await sget("nutri:badgesSeen", []));
      setLastWeekAI(await sget("nutri:lastWeekAI", null));
      setHabitudes(await sget("nutri:habitudes", []));
      setLoaded(true);
      // Charge la base d'aliments partagée (asynchrone, non bloquant).
      if (typeof window !== "undefined" && window.NUTRI_SHARED_FOODS) {
        try {
          const arr = await window.NUTRI_SHARED_FOODS.list();
          const mapped = (arr || []).map((it) => ({
            id: "sh_" + (it.code || uid()),
            code: it.code,
            nom: it.nom,
            grp: it.grp || "plat",
            kcal: Number(it.kcal) || 0,
            p: Number(it.p) || 0,
            c: Number(it.c) || 0,
            f: Number(it.f) || 0,
            fib: Number(it.fib) || 0,
            suc: Number(it.suc) || 0,
            shared: true,
            contributions: Number(it.contributions) || 1,
          }));
          setSharedFoods(mapped);
        } catch {}
      }
    })();
  }, []);

  useEffect(() => { if (loaded) sset("nutri:profil", profil); }, [profil, loaded]);
  useEffect(() => { if (loaded) sset("nutri:poidslog", poidsLog); }, [poidsLog, loaded]);
  useEffect(() => { if (loaded) sset("nutri:diary", diary); }, [diary, loaded]);
  useEffect(() => { if (loaded) sset("nutri:customfoods", customFoods); }, [customFoods, loaded]);
  useEffect(() => { if (loaded) sset("nutri:mealphotos", mealPhotos); }, [mealPhotos, loaded]);
  useEffect(() => { if (loaded) sset("nutri:sport", sport); }, [sport, loaded]);
  useEffect(() => { if (loaded) sset("nutri:customsports", customSports); }, [customSports, loaded]);
  useEffect(() => { if (loaded) sset("nutri:favmeals", favMeals); }, [favMeals, loaded]);
  useEffect(() => { if (loaded) sset("nutri:water", water); }, [water, loaded]);
  useEffect(() => { if (loaded) sset("nutri:badgesSeen", badgesSeen); }, [badgesSeen, loaded]);
  useEffect(() => { if (loaded) sset("nutri:lastWeekAI", lastWeekAI); }, [lastWeekAI, loaded]);
  useEffect(() => { if (loaded) sset("nutri:habitudes", habitudes); }, [habitudes, loaded]);

  /* Détection de déblocage de badges → notification locale + toast. */
  useEffect(() => {
    if (!loaded) return;
    const stats = computeBadgeStats({ diary, profil, poidsLog, customFoods, favMeals, sport });
    const unlockedIds = BADGES.filter((b) => b.test(stats)).map((b) => b.id);
    const newlyUnlocked = unlockedIds.filter((id) => !badgesSeen.includes(id));
    if (newlyUnlocked.length) {
      const first = BADGES.find((b) => b.id === newlyUnlocked[0]);
      if (first) {
        try {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("🏆 Badge débloqué !", { body: first.t + " — " + first.d });
          }
        } catch {}
      }
      setBadgesSeen((prev) => [...prev, ...newlyUnlocked]);
    }
  }, [diary, profil, poidsLog, customFoods, favMeals, sport, loaded]);

  // Rappels : notifications quand l'app est ouverte (arrière-plan une fois installée en PWA).
  useEffect(() => {
    if (!loaded) return;
    const actifs = (profil.rappels || []).filter((r) => r.on);
    if (!actifs.length || typeof Notification === "undefined") return;
    const fired = {};
    const iv = setInterval(() => {
      const now = new Date();
      const jour = now.toISOString().slice(0, 10);
      actifs.forEach((r) => {
        if (now.getHours() === r.h && now.getMinutes() === r.m) {
          const fk = `${jour}:${r.id}`;
          if (!fired[fk]) {
            fired[fk] = true;
            try { if (Notification.permission === "granted") new Notification("NutriSuivi", { body: r.label }); } catch {}
          }
        }
      });
    }, 20000);
    return () => clearInterval(iv);
  }, [profil.rappels, loaded]);

  // Rappel du soir : si un repas principal n'est pas rempli.
  const mealRemindRef = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    const r = profil.rappelRepas || { on: true, h: 21, m: 30 };
    if (!r.on || typeof Notification === "undefined") return;
    scheduleMealReminder(r.h, r.m);
    const check = () => {
      const now = new Date();
      const today = todayISO();
      if (now.getHours() * 60 + now.getMinutes() >= r.h * 60 + r.m && mealRemindRef.current !== today) {
        if (repasIncomplets(diary, today).length) {
          mealRemindRef.current = today;
          try { if (Notification.permission === "granted") new Notification("NutriSuivi", { body: "Il te reste des repas à compléter aujourd'hui 🍽️" }); } catch (e) {}
        }
      }
    };
    check();
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, [profil.rappelRepas, diary, loaded]);

  function addEntries(entries) { setDiary((d) => ({ ...d, [dateSel]: [...(d[dateSel] || []), ...entries] })); }
  function editEntry(id, newGrams) {
    setDiary((d) => {
      const arr = (d[dateSel] || []).map((e) => {
        if (e.id !== id) return e;
        const g = Number(newGrams);
        const food = catalog.find((f) => f.id === e.foodId);
        if (food) return { ...e, grams: g, kcal: food.kcal * g / 100, p: food.p * g / 100, c: food.c * g / 100, f: food.f * g / 100, fib: (food.fib || 0) * g / 100, suc: (food.suc || 0) * g / 100 };
        const factor = g / e.grams;
        return { ...e, grams: g, kcal: e.kcal * factor, p: e.p * factor, c: e.c * factor, f: e.f * factor, fib: (e.fib || 0) * factor, suc: (e.suc || 0) * factor };
      });
      return { ...d, [dateSel]: arr };
    });
  }
  function duplicatePrevDay() {
    const prev = shiftDate(dateSel, -1);
    const items = (diary[prev] || []).map((e) => ({ ...e, id: uid() }));
    if (!items.length) return;
    setDiary((d) => ({ ...d, [dateSel]: [...(d[dateSel] || []), ...items] }));
  }
  function saveFavorite(repasId) {
    const items = (diary[dateSel] || []).filter((e) => e.repas === repasId);
    if (!items.length) return;
    const label = (REPAS.find((r) => r.id === repasId) || {}).label || "Repas";
    const nom = (window.prompt("Nom du repas à enregistrer :", label) || "").trim();
    if (!nom) return;
    setFavMeals((f) => [...f, { id: "fav_" + uid(), nom, items: items.map(({ repas, id, photo, ...rest }) => rest) }]);
  }
  function deleteFavorite(id) { setFavMeals((f) => f.filter((x) => x.id !== id)); }
  function renameFavorite(id, nom) { setFavMeals((f) => f.map((x) => x.id === id ? { ...x, nom } : x)); }
  function updateFavorite(id, items) { setFavMeals((f) => f.map((x) => x.id === id ? { ...x, items } : x)); }
  function addFavoriteToDay(fav, repasId) {
    const entries = fav.items.map((it) => ({ ...it, id: uid(), repas: repasId }));
    setDiary((d) => ({ ...d, [dateSel]: [...(d[dateSel] || []), ...entries] }));
  }
  async function exportData() {
    const keys = ["nutri:profil", "nutri:poidslog", "nutri:diary", "nutri:customfoods", "nutri:mealphotos", "nutri:sport", "nutri:customsports", "nutri:favmeals"];
    const dump = {};
    for (const k of keys) dump[k] = await sget(k, null);
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "nutrisuivi-sauvegarde.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function importData(file) {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const dump = JSON.parse(ev.target.result);
        for (const [k, v] of Object.entries(dump)) { if (v != null) await sset(k, v); }
        if (dump["nutri:profil"]) setProfil(dump["nutri:profil"]);
        if (dump["nutri:poidslog"]) setPoidsLog(dump["nutri:poidslog"]);
        if (dump["nutri:diary"]) setDiary(dump["nutri:diary"]);
        if (dump["nutri:customfoods"]) setCustomFoods(dump["nutri:customfoods"]);
        if (dump["nutri:mealphotos"]) setMealPhotos(dump["nutri:mealphotos"]);
        if (dump["nutri:sport"]) setSport(dump["nutri:sport"]);
        if (dump["nutri:customsports"]) setCustomSports(dump["nutri:customsports"]);
        if (dump["nutri:favmeals"]) setFavMeals(dump["nutri:favmeals"]);
        window.alert("Sauvegarde importée ✓");
      } catch { window.alert("Fichier invalide."); }
    };
    reader.readAsText(file);
  }
  async function resetAll() {
    if (!window.confirm("Effacer toutes tes données (repas, sport, poids, réglages) ? Action irréversible.")) return;
    try {
      const r = await window.storage.list("nutri:");
      for (const k of (r && r.keys ? r.keys : [])) await window.storage.delete(k);
    } catch {}
    location.reload();
  }

  function addSport(entry) { setSport((s) => ({ ...s, [dateSel]: [...(s[dateSel] || []), entry] })); }
  function delSport(id) { setSport((s) => ({ ...s, [dateSel]: (s[dateSel] || []).filter((e) => e.id !== id) })); }
  function addCustomSport(sp) {
    const s = { id: "us_" + uid(), nom: sp.nom, kcalH: Number(sp.kcalH) || 0 };
    setCustomSports((cs) => [...cs, s]);
    return s;
  }

  function setMealPhoto(date, repas, url) {
    setMealPhotos((mp) => ({ ...mp, [date]: { ...(mp[date] || {}), [repas]: url } }));
  }
  function clearMealPhoto(date, repas) {
    setMealPhotos((mp) => { const day = { ...(mp[date] || {}) }; delete day[repas]; return { ...mp, [date]: day }; });
  }

  const bmr = useMemo(() => mifflin(profil), [profil]);
  const maintenance = useMemo(() => Math.round(bmr * (neatF(profil) + sportB(profil))), [bmr, profil.neat, profil.sportFreq]);
  const cible = Math.max(1400, maintenance - profil.deficit);
  const cibleProt = Math.round(profil.poids * 1.8);
  const cibleLipMin = Math.round(profil.poids * 0.8);
  const cibleGluc = Math.max(0, Math.round((cible - cibleProt * 4 - cibleLipMin * 9) / 4));

  const totJour = useMemo(() => sommeMacros(diary[dateSel]), [diary, dateSel]);

  function addEntry(entry) { setDiary((d) => ({ ...d, [dateSel]: [...(d[dateSel] || []), entry] })); }
  function delEntry(id) { setDiary((d) => ({ ...d, [dateSel]: (d[dateSel] || []).filter((e) => e.id !== id) })); }
  function addCustomFood(f) {
    const food = {
      id: "u_" + uid(), nom: f.nom, grp: f.grp || "extra",
      kcal: Number(f.kcal) || 0, p: Number(f.p) || 0, c: Number(f.c) || 0, f: Number(f.f) || 0,
      fib: Number(f.fib) || 0, suc: Number(f.suc) || 0,
      code: f.code || null,
    };
    setCustomFoods((cf) => [...cf, food]);
    // Contribue à la base partagée (async, non bloquant)
    submitToSharedDB({
      code: food.code, nom: food.nom, grp: food.grp,
      kcal: food.kcal, p: food.p, c: food.c, f: food.f,
      fib: food.fib, suc: food.suc,
      source: food.code ? "scan" : "encoded",
    });
    return food;
  }

  function finishOnboarding() { sset("nutri:onboarding_done", true); setShowOnboarding(false); }
  function addWater(delta) { setWater((w) => ({ ...w, [dateSel]: Math.max(0, (w[dateSel] || 0) + delta) })); }
  function finishSetup() { sset("nutri:setup_done", true); setShowSetup(false); }
  function exportCSV() {
    const rows = [["date", "repas", "aliment", "grammes", "kcal", "prot", "gluc", "lip", "fibres", "sucres"]];
    Object.keys(diary).sort().forEach((date) => {
      (diary[date] || []).forEach((e) => {
        const lbl = (REPAS.find((r) => r.id === e.repas) || {}).label || e.repas || "";
        rows.push([date, lbl, (e.nom || "").replace(/;/g, ","), e.grams ?? "", Math.round(e.kcal || 0), Math.round(e.p || 0), Math.round(e.c || 0), Math.round(e.f || 0), Math.round(e.fib || 0), Math.round(e.suc || 0)]);
      });
    });
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "nutrisuivi-journal.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (!loaded) return <Splash />;

  const todayLong = new Date().toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const dateHeader = todayLong.charAt(0).toUpperCase() + todayLong.slice(1);
  const todayKcal = sommeMacros(diary[todayISO()]).kcal;
  const todayCredited = profil.crediterSport ? creditedKcal(todayISO(), sport, profil.partSport ?? 70, profil.sportMode ?? "jour", profil.sportSpreadDays ?? 7) : 0;
  const todayTarget = cible + todayCredited;
  const todayPct = todayTarget > 0 ? Math.round((todayKcal / todayTarget) * 100) : 0;
  const badgeColor = todayPct <= 100 ? C.accent : C.negative;

  const badgeNavyOk = todayPct <= 100 ? "#fff" : C.negative;
  const badgeToday = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.25)" }}
      title={`${Math.round(todayKcal)} sur ${todayTarget} kcal — clic pour aller à l'Agenda`}
      onClick={() => setTab("agenda")}>
      <div style={{ fontSize: 11, color: C.navyText, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, cursor: "pointer" }}>Aujourd'hui</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: badgeNavyOk, letterSpacing: "-0.01em", cursor: "pointer" }}>{todayPct} %</div>
      <div style={{ width: 60, height: 5, background: "rgba(255,255,255,0.18)", cursor: "pointer" }}>
        <div style={{ width: `${Math.min(100, todayPct)}%`, height: "100%", background: badgeNavyOk }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Archivo', system-ui, sans-serif" }}>
      <StyleInject />

      {isDesktop && (
        <header style={{ background: C.navy, borderBottom: "none", position: "sticky", top: 0, zIndex: 5 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ ...S.logo, fontSize: 20, color: "#fff" }}>NutriSuivi</div>
            <nav style={{ display: "flex", gap: 4, flex: 1 }}>
              {[["agenda", "Agenda"], ["semaine", "Semaine"], ["liste", "Liste"], ["graphique", "Graphique"], ["profil", "Profil"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{ background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: tab === id ? 700 : 500, color: tab === id ? "#fff" : C.navyText, borderBottom: tab === id ? "2px solid #fff" : "2px solid transparent", marginBottom: -2 }}>
                  {label}
                </button>
              ))}
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {badgeToday}
              <div style={{ fontSize: 12, color: C.navyText, textAlign: "right", lineHeight: 1.4 }}>
                <div>{dateHeader}</div>
                <div>Objectif {profil.objectif} kg</div>
              </div>
            </div>
          </div>
        </header>
      )}

      <div style={isDesktop ? { maxWidth: 1200, margin: "0 auto", padding: "0 40px", boxSizing: "border-box" } : {}}>
        <div style={{ minWidth: 0, maxWidth: isDesktop ? "none" : 480, margin: isDesktop ? 0 : "0 auto", width: "100%" }}>
          {!isDesktop && (
            <header style={S.header}>
              <div>
                <div style={S.logo}>NutriSuivi</div>
                <div style={S.sub}>Objectif {profil.objectif} kg · {cible} kcal/jour</div>
              </div>
              {badgeToday}
            </header>
          )}

          <main style={{ ...S.main, padding: isDesktop ? "0 0 40px" : "4px 14px 96px" }}>
        {tab === "agenda" && (
          <Agenda diary={diary} dateSel={dateSel} setDateSel={setDateSel}
            tot={totJour} cible={cible} cibleProt={cibleProt} cibleGluc={cibleGluc} cibleLipMin={cibleLipMin}
            onDel={delEntry} onAdd={(rid) => { if (rid) setAddRepas(rid); setAddOpen(true); }}
            onEditGrams={editEntry} onAddDirect={addEntry}
            catalog={catalog} favMeals={favMeals} onAddFavorite={addFavoriteToDay}
            copyFromDate={(src) => {
              const items = (diary[src] || []).map((e) => ({ ...e, id: uid() }));
              if (!items.length) return;
              setDiary((d) => ({ ...d, [dateSel]: [...(d[dateSel] || []), ...items] }));
            }}
            monthReview={(() => {
              const now = new Date();
              // Cache si vu ce mois-ci OU si on est avant le 3 du mois (données incomplètes)
              const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
              if (monthReviewSeen === key || now.getDate() < 3) return null;
              const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              return monthlyReview(diary, sport, poidsLog, prev.getFullYear(), prev.getMonth());
            })()}
            onDismissMonthReview={() => {
              const now = new Date();
              const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
              setMonthReviewSeen(key); sset("nutri:monthReviewSeen", key);
            }}
            mealPhotos={mealPhotos} onMealPhoto={setMealPhoto} onClearMealPhoto={clearMealPhoto}
            sportAll={sport} sportEntries={sport[dateSel] || []} onAddSport={() => setSportOpen(true)}
            onDelSport={delSport} crediterSport={profil.crediterSport} partSport={profil.partSport ?? 60}
            sportMode={profil.sportMode ?? "jour"} sportSpreadDays={profil.sportSpreadDays ?? 7} onEditEntry={setEditData}
            onSaveFavorite={saveFavorite} onDuplicatePrev={duplicatePrevDay} isDesktop={isDesktop}
            water={water[dateSel] || 0} waterGoal={profil.waterGoal ?? 8} onAddWater={addWater} />
        )}
        {tab === "semaine" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Semaine diary={diary} sport={sport} poidsLog={poidsLog} water={water}
              cible={cible} cibleProt={cibleProt} cibleLipMin={cibleLipMin}
              waterGoal={profil.waterGoal ?? 8}
              lastWeekAI={lastWeekAI} setLastWeekAI={setLastWeekAI} />
          </div>
        )}
        {tab === "liste" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Liste catalog={catalog} customFoods={customFoods} setCustomFoods={setCustomFoods}
              customSports={customSports} setCustomSports={setCustomSports} poids={profil.poids}
              favMeals={favMeals} onDeleteFavorite={deleteFavorite} onRenameFavorite={renameFavorite}
              onUpdateFavorite={updateFavorite}
              habitudes={habitudes} setHabitudes={setHabitudes}
              sharedCount={sharedFoods.length} totalCount={catalog.length} />
          </div>
        )}
        {tab === "graphique" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Graphique diary={diary} cible={cible} poidsLog={poidsLog} objectif={profil.objectif} sport={sport}
              maintenance={maintenance} crediterSport={profil.crediterSport} partSport={profil.partSport ?? 60}
              sportMode={profil.sportMode ?? "jour"} sportSpreadDays={profil.sportSpreadDays ?? 7} />
          </div>
        )}
        {tab === "profil" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Profil profil={profil} setProfil={setProfil} bmr={bmr} maintenance={maintenance}
              cible={cible} cibleProt={cibleProt} poidsLog={poidsLog} setPoidsLog={setPoidsLog}
              onExport={exportData} onExportCSV={exportCSV} onImport={importData} onReset={resetAll}
              onReplayTutorial={() => setShowOnboarding(true)}
              diary={diary} customFoods={customFoods} favMeals={favMeals} sport={sport} />
          </div>
        )}
          </main>
        </div>
      </div>

      {addOpen && (
        <AddSheet key={addRepas} catalog={catalog} date={dateSel} onCreateFood={addCustomFood} initialRepas={addRepas}
          onClose={() => setAddOpen(false)} onAdd={addEntry}
          diary={diary} favMeals={favMeals} onAddFavorite={addFavoriteToDay} onDeleteFavorite={deleteFavorite} onAddMany={addEntries} />
      )}

      {editData && (
        <EditSheet entry={editData} catalog={catalog}
          onClose={() => setEditData(null)} onSave={(g) => { editEntry(editData.id, g); setEditData(null); }} />
      )}

      {sportOpen && (
        <SportSheet sports={allSports} poids={profil.poids} date={dateSel}
          onClose={() => setSportOpen(false)} onAdd={addSport} onCreate={addCustomSport} />
      )}

      {showSetup
        ? <Assistant profil={profil} setProfil={setProfil} onDone={finishSetup} />
        : showOnboarding && <Onboarding onDone={finishOnboarding} />}

      {!isDesktop && (
        <nav style={S.nav}>
          {[["agenda", "Agenda", "▦"], ["semaine", "Semaine", "▥"], ["liste", "Liste", "☰"], ["graphique", "Graphique", "▤"], ["profil", "Profil", "◇"]].map(([id, label, ic]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ ...S.navBtn, ...(tab === id ? S.navBtnOn : {}) }}>
              <span style={{ fontSize: 19, lineHeight: 1 }}>{ic}</span>
              <span style={{ fontSize: 11 }}>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

/* ============================ AGENDA ============================= */
function Agenda({ diary, dateSel, setDateSel, tot, cible, cibleProt, cibleGluc, cibleLipMin, onDel, onAdd, onEditGrams, onAddDirect, catalog, favMeals, onAddFavorite, copyFromDate, monthReview, onDismissMonthReview, mealPhotos, onMealPhoto, onClearMealPhoto, sportAll, sportEntries, onAddSport, onDelSport, crediterSport, partSport, sportMode, sportSpreadDays, onEditEntry, onSaveFavorite, onDuplicatePrev, isDesktop, water, waterGoal, onAddWater }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(dateSel); return { y: d.getFullYear(), m: d.getMonth() }; });
  const sportKcal = sommeSport(sportEntries);
  const credited = crediterSport ? creditedKcal(dateSel, sportAll, partSport, sportMode, sportSpreadDays) : 0;
  const cibleJour = cible + credited;
  const reste = cibleJour - Math.round(tot.kcal);
  const weekSport = useMemo(() => {
    const dow = (new Date(dateSel).getDay() + 6) % 7;
    const monday = shiftDate(dateSel, -dow);
    let s = 0;
    for (let i = 0; i < 7; i++) s += sommeSport(sportAll[shiftDate(monday, i)]);
    return Math.round(s);
  }, [dateSel, sportAll]);
  const motivation = useMemo(() => {
    const dow = (new Date(todayISO()).getDay() + 6) % 7;
    const monday = shiftDate(todayISO(), -dow);
    let kcal = 0;
    for (let i = 0; i < 7; i++) kcal += sommeSport(sportAll[shiftDate(monday, i)]);
    return { kcal: Math.round(kcal), gFat: Math.round(kcal / 7.7) };
  }, [sportAll]);
  const isToday = dateSel === todayISO();
  const parRepas = REPAS.map((r) => ({ ...r, items: (diary[dateSel] || []).filter((e) => e.repas === r.id) }));

  const grid = useMemo(() => buildMonth(cursor.y, cursor.m), [cursor]);

  const calendrier = (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button style={S.dateArrow} onClick={() => setCursor(shiftMonth(cursor, -1))}>‹</button>
        <div style={{ fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
          {moisNom[cursor.m]} {cursor.y}
        </div>
        <button style={S.dateArrow} onClick={() => setCursor(shiftMonth(cursor, 1))}>›</button>
      </div>
      <div style={S.calHead}>
        {joursCal.map((j, i) => <div key={i} style={S.calHeadCell}>{j}</div>)}
      </div>
      <div style={S.calGrid}>
        {grid.map((cell, i) => {
          if (!cell) return <div key={i} style={{ background: "#fff", border: `1px solid ${C.divider}`, aspectRatio: "1", margin: -0.5 }} />;
          const items = diary[cell] || [];
          const mealsDone = new Set(items.map((x) => x.repas));
          const mainMeals = ["petitdej", "midi", "soir"];
          const nMain = mainMeals.filter((m) => mealsDone.has(m)).length;
          const allDone = nMain === 3;
          const partial = nMain > 0 && !allDone;
          const hasSport = ((sportAll[cell]) || []).length > 0;
          const sel = cell === dateSel;
          const tdy = cell === todayISO();
          const mealColor = sel ? "#fff" : allDone ? "#2C6E49" : partial ? "#E0912F" : null;
          const sportColor = sel ? "#fff" : "#C0562B";
          return (
            <button key={i} onClick={() => setDateSel(cell)}
              style={{ ...S.calCell, ...(sel ? S.calCellSel : {}), ...(tdy && !sel ? S.calCellToday : {}) }}>
              <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500 }}>{Number(cell.slice(-2))}</span>
              <span style={{ display: "flex", gap: 3, minHeight: 5, alignItems: "center", justifyContent: "center" }}>
                {mealColor && <span style={{ ...S.calDot, background: mealColor, opacity: sel ? 0.85 : 1 }} title={allDone ? "Tous les repas complétés" : "Repas partiels"} />}
                {hasSport && <span style={{ ...S.calDot, background: sportColor, opacity: sel ? 0.6 : 1 }} title="Sport ce jour" />}
              </span>
            </button>
          );
        })}
      </div>
      {/* Légende */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12, fontSize: 11, color: C.muted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, background: "#2C6E49" }} /> Repas complets
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, background: "#E0912F" }} /> Repas partiels
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, background: "#C0562B" }} /> Sport
        </span>
      </div>
    </div>
  );

  /* --- Bloc résumé "Aujourd'hui" (col gauche desktop, en tête mobile) --- */
  const pct = Math.min(100, Math.round((tot.kcal / cibleJour) * 100));
  const kcalConsommees = Math.round(tot.kcal);
  const kcalRestantes = reste;
  const streak = useMemo(() => streakUnderTarget(diary, cible), [diary, cible]);
  const recents = useMemo(() => recentUniqueFoods(diary, catalog || [], 4), [diary, catalog]);

  const Macro = ({ label, v, cible, min, unit }) => {
    const val = Math.round(v);
    const cap = cible || (min ? min * 2 : 100);
    const p = Math.min(100, (val / cap) * 100);
    return (
      <div style={{ flex: 1 }}>
        <div style={{ ...S.sectionLabel, fontSize: 10, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {val}<span style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginLeft: 3 }}>{unit}</span>
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{cible ? `sur ${cible}${unit}` : `min ${min}${unit}`}</div>
        <div style={{ height: 4, background: C.divider, marginTop: 6 }}>
          <div style={{ width: `${p}%`, height: "100%", background: C.accent }} />
        </div>
      </div>
    );
  };

  const panneauResume = (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={S.kicker}>{isToday ? "AUJOURD'HUI" : jolieDate(dateSel).toUpperCase()}</div>
        {!isToday && <button style={S.linkBtn} onClick={() => setDateSel(todayISO())}>Aujourd'hui</button>}
      </div>
      <div style={S.kickerTrait} />

      <div style={{ ...S.bigNum, fontSize: isDesktop ? 112 : 72, color: C.accent }}>
        {kcalRestantes >= 0 ? kcalRestantes : `+${-kcalRestantes}`}
      </div>
      <div style={{ ...S.miniMuted, marginTop: 8, fontSize: 13 }}>
        {kcalRestantes >= 0 ? "kcal restantes" : "kcal au-dessus"} · {kcalConsommees} sur {cibleJour} kcal consommées · {pct} %
      </div>

      <div style={{ height: 8, background: C.divider, marginTop: 22 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: kcalRestantes >= 0 ? C.accent : C.negative }} />
      </div>

      {crediterSport && credited > 0 && (
        <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
          {sportMode === "reparti"
            ? `+${credited} kcal/jour lissés sur ${sportSpreadDays ?? 7} jours (sport crédité).`
            : `+${credited} kcal crédités du sport (${partSport ?? 60} % de ${Math.round(sportKcal)} dépensées).`}
        </div>
      )}

      <div style={{ display: "flex", gap: 24, marginTop: 32, paddingTop: 22, borderTop: `2px solid ${C.divider}` }}>
        <Macro label="Protéines" v={tot.p} cible={cibleProt} unit="g" />
        <Macro label="Glucides" v={tot.c} cible={cibleGluc} unit="g" />
        <Macro label="Lipides" v={tot.f} min={cibleLipMin} unit="g" />
      </div>

      {(tot.fib > 0 || tot.suc > 0) && (
        <div style={{ fontSize: 11, color: C.muted, marginTop: 16, display: "flex", gap: 24 }}>
          <span>FIBRES <b style={{ color: C.ink, marginLeft: 4 }}>{Math.round(tot.fib)} g</b></span>
          <span>SUCRES <b style={{ color: C.ink, marginLeft: 4 }}>{Math.round(tot.suc)} g</b></span>
        </div>
      )}

      {streak > 0 && (
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.divider}` }}>
          <div style={S.sectionLabel}>SÉRIE</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: C.accent, letterSpacing: "-0.02em", fontFamily: "'Archivo', sans-serif" }}>{streak}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{streak > 1 ? "jours consécutifs sous la cible (±5 %)" : "jour sous la cible"}</span>
          </div>
        </div>
      )}

      {/* Eau bue — avec dosage ml/L */}
      <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.divider}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
          <div>
            <div style={S.sectionLabel}>EAU BUE</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: C.accent, letterSpacing: "-0.02em", fontFamily: "'Archivo', sans-serif" }}>
                {(water * 0.25).toFixed(2).replace(".", ",")}
              </span>
              <span style={{ fontSize: 13, color: C.muted }}>L · {water * 250} ml · cible {waterGoal} verres ({waterGoal * 0.25} L)</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => onAddWater(-1)}
              style={{ width: 34, height: 34, border: `1px solid ${C.divider}`, background: "#fff", cursor: "pointer", color: C.accent, fontSize: 18, borderRadius: 0 }}
              title="−1 verre (250 ml)">−</button>
            <button onClick={() => onAddWater(1)}
              style={{ width: 34, height: 34, border: "none", background: C.accent, color: "#fff", cursor: "pointer", fontSize: 18, borderRadius: 0 }}
              title="+1 verre (250 ml)">+</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
          {Array.from({ length: Math.max(waterGoal, water) }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 8, background: i < water ? C.accent : C.divider }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>1 verre = 250 ml (verre standard)</div>
      </div>
    </div>
  );

  /* --- Bilan mensuel (bannière) --- */
  const bilanMensuel = monthReview && (
    <div style={{ ...S.cardFramed, marginBottom: 22, borderColor: C.accent, background: C.accentTint }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...S.kicker, color: C.accent }}>BILAN — {monthReview.monthName.toUpperCase()} {monthReview.year}</div>
          <div style={{ marginTop: 14, display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ ...S.sectionLabel, marginBottom: 4 }}>MOY. KCAL / JOUR</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.accent, letterSpacing: "-0.02em" }}>{monthReview.avgKcal || "—"}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{monthReview.daysLogged}/{monthReview.nbDays} j loggés</div>
            </div>
            {monthReview.kgDelta !== null && (
              <div>
                <div style={{ ...S.sectionLabel, marginBottom: 4 }}>POIDS</div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: monthReview.kgDelta <= 0 ? C.positive : C.negative }}>
                  {monthReview.kgDelta > 0 ? "+" : ""}{monthReview.kgDelta} kg
                </div>
              </div>
            )}
            <div>
              <div style={{ ...S.sectionLabel, marginBottom: 4 }}>SPORT</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.accent, letterSpacing: "-0.02em" }}>{monthReview.sessions}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>séances · {monthReview.totalSport} kcal</div>
            </div>
          </div>
        </div>
        <button onClick={onDismissMonthReview}
          style={{ ...S.del, flexShrink: 0 }}>×</button>
      </div>
    </div>
  );

  /* --- Ligne d'aliment avec [-] qté kcal [+] [×] --- */
  const QtyBtn = ({ children, onClick, title }) => (
    <button onClick={onClick} title={title}
      style={{ width: 30, height: 30, border: `1px solid ${C.divider}`, background: "#fff", cursor: "pointer", color: C.ink, fontSize: 16, display: "grid", placeItems: "center", padding: 0, borderRadius: 0 }}>
      {children}
    </button>
  );

  function bump(e, delta) {
    const g = Math.max(1, (Number(e.grams) || 0) + delta);
    if (onEditGrams) onEditGrams(e.id, g);
  }

  /* Ajout rapide : ajoute un aliment récent (100 g) directement dans le repas */
  function quickAdd(food, repas) {
    if (!onAddDirect) return;
    const g = 100;
    onAddDirect({ id: uid(), repas, foodId: food.id, nom: food.nom, grams: g,
      kcal: (food.kcal || 0), p: (food.p || 0), c: (food.c || 0), f: (food.f || 0),
      fib: (food.fib || 0), suc: (food.suc || 0) });
  }

  /* Mini-barre 3 segments P/G/L en kcal (P×4, G×4, L×9) */
  const MacrosBar = ({ p, c, f }) => {
    const kp = (p || 0) * 4, kc = (c || 0) * 4, kf = (f || 0) * 9;
    const tot = kp + kc + kf;
    if (tot <= 0) return null;
    const pp = (kp / tot) * 100, pc = (kc / tot) * 100, pf = (kf / tot) * 100;
    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", height: 4, background: C.divider }}>
          <div style={{ width: `${pp}%`, background: C.accent }} title={`Protéines ${Math.round(kp)} kcal`} />
          <div style={{ width: `${pc}%`, background: C.accentDark }} title={`Glucides ${Math.round(kc)} kcal`} />
          <div style={{ width: `${pf}%`, background: C.muted }} title={`Lipides ${Math.round(kf)} kcal`} />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, background: C.accent, marginRight: 4 }} />P {Math.round(pp)}%</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, background: C.accentDark, marginRight: 4 }} />G {Math.round(pc)}%</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, background: C.muted, marginRight: 4 }} />L {Math.round(pf)}%</span>
        </div>
      </div>
    );
  };

  /* --- Blocs repas nouveau format --- */
  const blocRepas = parRepas.map((r, idx) => {
    const repasMacros = sommeMacros(r.items);
    return (
      <div key={r.id} style={{ paddingTop: idx === 0 ? 0 : 22, borderTop: idx === 0 ? "none" : `2px solid ${C.divider}`, marginTop: idx === 0 ? 0 : 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 9, height: 9, background: C.accent, flexShrink: 0 }} />
            <span style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}>{r.label}</span>
            <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{r.h}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {r.items.length > 0 && <button style={S.favBtn} onClick={() => onSaveFavorite(r.id)}>★ Favori</button>}
            <span style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}>{Math.round(repasMacros.kcal)} kcal</span>
          </div>
        </div>

        {r.items.length === 0 ? (
          <div style={{ fontSize: 13, color: C.muted, padding: "12px 0", borderTop: `1px solid ${C.divider}`, marginTop: 8 }}>À compléter.</div>
        ) : (
          r.items.map((e) => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: `1px solid ${C.divider}`, marginTop: 8 }}>
              {e.photo && <img src={e.photo} alt="" style={S.thumb} />}
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => onEditEntry(e)}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{e.nom}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <QtyBtn onClick={() => bump(e, -10)} title="−10 g">−</QtyBtn>
                <InlineGrams entry={e} onSave={onEditGrams} />
                <QtyBtn onClick={() => bump(e, +10)} title="+10 g">+</QtyBtn>
                <button onClick={() => onDel(e.id)} title="Supprimer"
                  style={{ ...S.del, marginLeft: 4 }}>×</button>
              </div>
            </div>
          ))
        )}

        <button onClick={() => onAdd(r.id)}
          style={{ background: "none", border: "none", color: C.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 12, padding: "6px 0", fontFamily: "'Archivo', sans-serif", letterSpacing: "0.02em" }}>
          + Ajouter à {r.label}
        </button>
      </div>
    );
  });

  const blocSport = (
    <div style={{ paddingTop: 22, borderTop: `2px solid ${C.divider}`, marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 9, height: 9, background: C.accentDark, flexShrink: 0 }} />
          <span style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}>Sport</span>
          <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Semaine {weekSport} kcal</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}>{Math.round(sportKcal)} kcal</span>
      </div>

      {sportEntries.length === 0 ? (
        <div style={{ fontSize: 13, color: C.muted, padding: "12px 0", borderTop: `1px solid ${C.divider}`, marginTop: 8 }}>Aucune activité ce jour.</div>
      ) : (
        sportEntries.map((e) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: `1px solid ${C.divider}`, marginTop: 8 }}>
            {e.photo && <img src={e.photo} alt="" style={S.thumb} />}
            <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: C.ink }}>{e.nom}</div>
            <span style={{ fontSize: 12, color: C.muted, minWidth: 130, textAlign: "right" }}>{e.minutes} min · {Math.round(e.kcal)} kcal</span>
            <button style={{ ...S.del, marginLeft: 8 }} onClick={() => onDelSport(e.id)}>×</button>
          </div>
        ))
      )}

      <button onClick={onAddSport}
        style={{ background: "none", border: "none", color: C.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 12, padding: "6px 0", fontFamily: "'Archivo', sans-serif", letterSpacing: "0.02em" }}>
        + Ajouter du sport
      </button>
    </div>
  );

  const panneauRepas = (
    <div>
      {bilanMensuel}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: C.ink }}>Repas du jour</div>
        <CopyMenu
          onCopyPrev={onDuplicatePrev}
          onCopyFromDate={(src) => copyFromDate && copyFromDate(src)}
          onCopyFavorite={(fav) => onAddFavorite && onAddFavorite(fav, "midi")}
          dateSel={dateSel}
          favMeals={favMeals || []}
        />
      </div>
      <div style={{ borderTop: `2px solid ${C.divider}`, paddingTop: 22 }}>
        {blocRepas}
        {blocSport}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "460px 1fr", gap: 0, alignItems: "stretch", background: C.bg, minHeight: "calc(100vh - 80px)" }}>
        <div style={{ padding: "40px 44px 60px", borderRight: `2px solid ${C.divider}`, display: "flex", flexDirection: "column", gap: 32 }}>
          {panneauResume}
          <div style={{ borderTop: `2px solid ${C.divider}`, paddingTop: 24 }}>
            <div style={{ ...S.sectionLabel, marginBottom: 14 }}>CALENDRIER</div>
            {calendrier}
          </div>
        </div>
        <div style={{ padding: "40px 44px 60px" }}>
          {panneauRepas}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "8px 4px" }}>
      {panneauResume}
      <div style={{ borderTop: `2px solid ${C.divider}`, paddingTop: 22 }} />
      {calendrier}
      {panneauRepas}
    </div>
  );
}

/* Clic sur le nombre de grammes d'un aliment → input inline pour taper une valeur libre. */
function InlineGrams({ entry, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(entry.grams));
  useEffect(() => { if (!editing) setVal(String(entry.grams)); }, [entry.grams, editing]);

  function commit() {
    const g = Math.max(1, Math.round(Number(val)) || entry.grams);
    if (g !== entry.grams && onSave) onSave(entry.id, g);
    setEditing(false);
  }

  if (editing) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, minWidth: 90, justifyContent: "center" }}>
        <input type="number" autoFocus value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { setVal(String(entry.grams)); setEditing(false); } }}
          style={{ width: 56, padding: "2px 6px", fontSize: 12, border: `1px solid ${C.accent}`, borderRadius: 0, textAlign: "right", fontFamily: "'Archivo', sans-serif", outline: "none", color: C.ink, background: "#fff" }} />
        <span style={{ fontSize: 11, color: C.muted }}>g</span>
      </span>
    );
  }
  return (
    <span onClick={() => setEditing(true)}
      title="Cliquer pour taper une valeur libre"
      style={{ fontSize: 12, color: C.muted, minWidth: 90, textAlign: "center", cursor: "pointer", borderBottom: `1px dashed ${C.divider}`, padding: "2px 0" }}>
      {entry.grams} g · {Math.round(entry.kcal)} kcal
    </span>
  );
}

/* Menu déroulant "Copier depuis..." (veille / autre jour / favori) */
function CopyMenu({ onCopyPrev, onCopyFromDate, onCopyFavorite, dateSel, favMeals }) {
  const [open, setOpen] = useState(false);
  const [pickDate, setPickDate] = useState(false);
  const [pickFav, setPickFav] = useState(false);
  const [d, setD] = useState(shiftDate(dateSel, -1));

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} style={S.linkBtn}>
        ⧉ Copier depuis… {open ? "▲" : "▼"}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: "#fff", border: `2px solid ${C.ink}`, minWidth: 240, zIndex: 20, padding: 8 }}>
          {!pickDate && !pickFav && (
            <>
              <button onClick={() => { onCopyPrev(); setOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif", fontSize: 13, color: C.ink }}>
                ⧉ La veille
              </button>
              <button onClick={() => setPickDate(true)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif", fontSize: 13, color: C.ink, borderTop: `1px solid ${C.divider}` }}>
                📅 Un autre jour…
              </button>
              <button onClick={() => setPickFav(true)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif", fontSize: 13, color: C.ink, borderTop: `1px solid ${C.divider}` }}>
                ★ Un favori… {favMeals.length ? `(${favMeals.length})` : ""}
              </button>
            </>
          )}
          {pickDate && (
            <div style={{ padding: 8 }}>
              <div style={{ ...S.sectionLabel, marginBottom: 8 }}>DATE À COPIER</div>
              <input type="date" value={d} max={todayISO()}
                onChange={(e) => setD(e.target.value)}
                style={{ ...S.input, marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { onCopyFromDate(d); setOpen(false); setPickDate(false); }}
                  style={{ ...S.primaryBtn, marginTop: 0, flex: 1, padding: "10px 0" }}>Copier</button>
                <button onClick={() => setPickDate(false)}
                  style={{ padding: "10px 12px", border: `1px solid ${C.divider}`, background: "#fff", cursor: "pointer", fontSize: 13, color: C.ink }}>Retour</button>
              </div>
            </div>
          )}
          {pickFav && (
            <div style={{ padding: 8, maxHeight: 240, overflowY: "auto" }}>
              <div style={{ ...S.sectionLabel, marginBottom: 8 }}>FAVORI À AJOUTER</div>
              {favMeals.length === 0 ? (
                <div style={{ ...S.miniMuted, fontSize: 12, padding: "4px 0" }}>Aucun favori enregistré.</div>
              ) : (
                favMeals.map((fav) => (
                  <button key={fav.id} onClick={() => { onCopyFavorite(fav); setOpen(false); setPickFav(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif", fontSize: 13, color: C.ink, borderTop: `1px solid ${C.divider}` }}>
                    ★ {fav.nom} <span style={{ color: C.muted, fontSize: 11 }}>· {Math.round(fav.items.reduce((a, i) => a + (i.kcal || 0), 0))} kcal</span>
                  </button>
                ))
              )}
              <button onClick={() => setPickFav(false)}
                style={{ marginTop: 8, padding: "8px 12px", border: `1px solid ${C.divider}`, background: "#fff", cursor: "pointer", fontSize: 12, color: C.ink }}>Retour</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function buildMonth(y, m) {
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7; // lundi = 0
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= days; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(iso);
  }
  return cells;
}
function shiftMonth({ y, m }, delta) {
  const d = new Date(y, m + delta, 1);
  return { y: d.getFullYear(), m: d.getMonth() };
}

/* ======================= BOTTOM SHEET AJOUT ===================== */
/* ===================== SCAN CODE-BARRES ======================== */
/* Récupère un produit depuis Open Food Facts (base ouverte, valeurs /100 g). */
async function fetchOFF(code) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,brands,nutriments`;
  const r = await fetch(url);
  const j = await r.json();
  if (!j || j.status !== 1 || !j.product) return null;
  const n = j.product.nutriments || {};
  let kcal = n["energy-kcal_100g"];
  if (kcal == null && n["energy_100g"] != null) kcal = n["energy_100g"] / 4.184;
  const nom = [j.product.product_name, j.product.brands].filter(Boolean).join(" · ").slice(0, 60) || `Produit ${code}`;
  const num = (v) => (v != null && v !== "" ? +Number(v).toFixed(1) : "");
  return { code, nom, kcal: kcal != null ? Math.round(kcal) : "", p: num(n.proteins_100g), c: num(n.carbohydrates_100g), f: num(n.fat_100g), grp: "plat" };
}

function Scanner({ onClose, onResult }) {
  const videoRef = useRef();
  const streamRef = useRef();
  const photoInputRef = useRef();
  // mode : "menu" (choix), "live" (caméra en direct), "loading", "notfound", "error"
  const [mode, setMode] = useState("menu");
  const [manual, setManual] = useState("");
  const [msg, setMsg] = useState("");
  const rafRef = useRef();
  const detectorRef = useRef(null);
  const activeRef = useRef(true);

  const hasDetector = typeof window !== "undefined" && "BarcodeDetector" in window;
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const canLive = hasDetector && !isIOS && typeof navigator !== "undefined"
    && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  function stopCam() {
    try { streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
    streamRef.current = null;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }

  async function lookup(code) {
    stopCam(); setMode("loading"); setMsg(`Recherche du code ${code}…`);
    try {
      const prod = await fetchOFF(code);
      if (prod) onResult(prod);
      else { setMode("notfound"); setMsg(`Produit ${code} introuvable dans Open Food Facts. Encode-le à la main — il sera sauvegardé dans ta liste pour toujours.`); }
    } catch { setMode("error"); setMsg("Connexion à Open Food Facts impossible. Vérifie ta connexion, ou encode les valeurs à la main."); }
  }

  /* Décode un code-barres depuis une photo importée. */
  async function scanFromPhoto(file) {
    if (!file) return;
    setMode("loading"); setMsg("Analyse de la photo…");
    try {
      if (!hasDetector) {
        setMode("error");
        setMsg("Ton navigateur ne peut pas décoder l'image (fréquent sur iPhone). Tape le code à la main ci-dessous — c'est aussi rapide.");
        return;
      }
      const detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "qr_code"] });
      const bitmap = await createImageBitmap(file);
      const codes = await detector.detect(bitmap);
      if (codes && codes.length) { lookup(codes[0].rawValue); return; }
      setMode("error"); setMsg("Aucun code-barres reconnu sur la photo. Essaie une photo plus nette (bon éclairage, code bien cadré) ou tape le code à la main.");
    } catch { setMode("error"); setMsg("Impossible d'analyser la photo. Tape le code à la main ci-dessous."); }
  }

  /* Démarre la caméra en direct (uniquement sur bouton). */
  async function startLive() {
    if (!canLive) return;
    setMode("live"); setMsg("");
    try {
      detectorRef.current = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
      if (!activeRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }
      streamRef.current = stream;
      // Attend le prochain rendu pour que videoRef existe
      setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try { await videoRef.current.play(); } catch {}
        }
        const tick = async () => {
          if (!activeRef.current || !detectorRef.current || !videoRef.current) return;
          try {
            const codes = await detectorRef.current.detect(videoRef.current);
            if (codes && codes.length) { lookup(codes[0].rawValue); return; }
          } catch {}
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }, 50);
    } catch (e) {
      stopCam();
      setMode("error");
      setMsg(e && e.name === "NotAllowedError"
        ? "Tu n'as pas autorisé l'accès à la caméra. Autorise-le dans les réglages du navigateur, ou prends une photo à la place."
        : "La caméra n'est pas accessible (déjà utilisée par une autre app, ou bloquée). Prends une photo ou tape le code à la main.");
    }
  }

  useEffect(() => {
    activeRef.current = true;
    return () => { activeRef.current = false; stopCam(); };
  }, []);

  const BigChoice = ({ icon, label, sub, onClick, primary, disabled }) => (
    <button onClick={onClick} disabled={disabled}
      style={{ width: "100%", padding: "16px 18px", border: primary ? "none" : `1px solid ${C.divider}`,
        background: disabled ? C.divider : (primary ? C.accent : "#fff"),
        color: disabled ? C.muted : (primary ? "#fff" : C.ink),
        cursor: disabled ? "not-allowed" : "pointer", textAlign: "left",
        display: "flex", gap: 14, alignItems: "center", fontFamily: "'Archivo', sans-serif",
        marginBottom: 10, opacity: disabled ? 0.55 : 1 }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em" }}>{label}</span>
        <span style={{ display: "block", fontSize: 12, marginTop: 2, opacity: primary ? 0.85 : 0.6 }}>{sub}</span>
      </span>
    </button>
  );

  return (
    <div style={S.overlay} onClick={() => { stopCam(); onClose(); }}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={S.sheetGrab} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>📷 Scanner un produit</div>
          <button style={S.del} onClick={() => { stopCam(); onClose(); }}>×</button>
        </div>

        <div style={{ background: C.accentTint, padding: "8px 10px", marginBottom: 14, fontSize: 12, color: C.accent, lineHeight: 1.5 }}>
          Une fois trouvé, le produit est <b>sauvegardé pour toujours</b> — pour toi et pour tous les autres utilisateurs.
        </div>

        {mode === "menu" && (
          <>
            <div style={{ ...S.sectionLabel, marginBottom: 10 }}>CHOISIS UNE MÉTHODE</div>
            <BigChoice icon="🖼️" primary label="Prendre / choisir une photo"
              sub="Marche partout (iPhone, PC, Android). La méthode la plus fiable."
              onClick={() => photoInputRef.current && photoInputRef.current.click()} />
            <BigChoice icon="📹" label="Scanner en direct avec la caméra"
              sub={canLive ? "Chrome Android · vise le code-barres" : (isIOS ? "Indisponible sur iPhone — utilise la photo ci-dessus" : "Indisponible dans ce navigateur — utilise la photo")}
              onClick={startLive} disabled={!canLive} />
            <BigChoice icon="⌨️" label="Taper le code à la main"
              sub="13 chiffres au dos du produit — utilise le champ ci-dessous"
              onClick={() => { const inp = document.getElementById("scan-manual"); if (inp) inp.focus(); }} />

            <input ref={photoInputRef} type="file" accept="image/*" capture="environment"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files[0]) scanFromPhoto(e.target.files[0]); e.target.value = ""; }} />
          </>
        )}

        {mode === "live" && (
          <>
            <div style={{ position: "relative", overflow: "hidden", background: "#000", marginBottom: 10 }}>
              <video ref={videoRef} playsInline muted autoPlay style={{ width: "100%", display: "block", maxHeight: 320, objectFit: "cover", background: "#000" }} />
              <div style={{ position: "absolute", inset: "30% 12%", border: "2px solid rgba(255,255,255,.9)" }} />
              <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 11, textShadow: "0 1px 3px rgba(0,0,0,.7)" }}>
                Vise le code-barres — si l'image reste noire, ferme et utilise « Prendre une photo »
              </div>
            </div>
            <button onClick={() => { stopCam(); setMode("menu"); }}
              style={{ ...S.copyBtn, marginBottom: 12 }}>← Retour au choix</button>
          </>
        )}

        {mode === "loading" && (
          <div style={{ ...S.miniMuted, textAlign: "center", padding: 20, fontSize: 13 }}>{msg}</div>
        )}

        {(mode === "notfound" || mode === "error") && (
          <div style={{ background: "#FCF3E6", padding: "10px 12px", marginBottom: 14, fontSize: 13, lineHeight: 1.5, color: "#7A5A18" }}>
            {msg}
          </div>
        )}

        {(mode === "notfound" || mode === "error") && (
          <button onClick={() => { setMode("menu"); setMsg(""); }}
            style={{ ...S.copyBtn, marginBottom: 12 }}>← Retour au choix</button>
        )}

        <div style={{ borderTop: `2px solid ${C.divider}`, paddingTop: 14, marginTop: 6 }}>
          <div style={S.sectionLabel}>ENTRE LE CODE-BARRES À LA MAIN</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input id="scan-manual" style={{ ...S.input, flex: 1 }} inputMode="numeric" placeholder="ex : 5410228123456"
              value={manual} onChange={(e) => setManual(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && manual.trim() && lookup(manual.trim())} />
            <button style={{ ...S.primaryBtn, marginTop: 0, width: "auto", padding: "12px 16px" }}
              onClick={() => manual.trim() && lookup(manual.trim())}>Chercher</button>
          </div>
          <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
            Données Open Food Facts (base collaborative, produits belges inclus).
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== ESTIMATION PAR PHOTO (IA) ================ */
async function estimateFromPhoto(base64Data, mediaType) {
  const prompt = `Tu es nutritionniste. Analyse la photo de ce repas. Identifie chaque aliment visible et estime sa portion.
Réponds UNIQUEMENT avec un tableau JSON (aucun texte autour, pas de balises Markdown) :
[{"nom":"Pâtes bolognaise","grams":250,"kcal":390,"p":15,"c":55,"f":10,"fib":4,"suc":6}]
Règles : "grams" = poids estimé de la portion visible ; "kcal","p","c","f","fib" (fibres),"suc" (sucres) = valeurs pour CETTE portion (pas pour 100 g) ; inclus les matières grasses de cuisson que tu repères. Si rien n'est reconnaissable, renvoie [].`;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
          { type: "text", text: prompt },
        ],
      }],
    }),
  });
  const data = await response.json();
  const text = (data.content || []).map((i) => (i.type === "text" ? i.text : "")).join("").trim();
  const clean = text.replace(/```json|```/g, "").trim();
  const arr = JSON.parse(clean);
  return Array.isArray(arr) ? arr : [];
}

/* Génère un mini bilan pédagogique de la semaine via l'IA (nutrition + timing + points forts/faibles). */
async function analyseWeekIA({ days, diary, sport, cible, cibleProt, cibleLipMin, weightDelta }) {
  const perDay = days.map((d) => {
    const items = diary[d] || [];
    const s = sommeMacros(items);
    const parRepas = {};
    for (const e of items) {
      const r = e.repas || "autre";
      if (!parRepas[r]) parRepas[r] = 0;
      parRepas[r] += e.kcal || 0;
    }
    const sp = (sport[d] || []).map((x) => `${x.nom} ${x.minutes}min`).join(", ");
    return {
      date: d,
      kcal: Math.round(s.kcal),
      p: Math.round(s.p), c: Math.round(s.c), f: Math.round(s.f),
      fib: Math.round(s.fib), suc: Math.round(s.suc),
      repas: Object.fromEntries(Object.entries(parRepas).map(([k, v]) => [k, Math.round(v)])),
      sport: sp || null,
    };
  });
  const prompt = `Tu es nutritionniste avisé. J'ai suivi ma semaine — voici mes données jour par jour :
${JSON.stringify(perDay, null, 2)}

Cible/jour : ${cible} kcal, ${cibleProt}g de protéines, ≥${cibleLipMin}g de lipides.
Variation de poids sur la semaine : ${weightDelta === null ? "non mesurée" : weightDelta + " kg"}.

Rédige un bilan court (150-220 mots MAX) en 3 parties séparées par un saut de ligne :
1. **Ce qui a marché** (1-2 phrases concrètes basées sur mes chiffres).
2. **Ce qui accroche** (1-2 phrases sur un point d'attention réel : timing des repas, macro déséquilibrée, jour à trou…).
3. **Une action simple pour la semaine prochaine** (1 phrase actionnable).

Ton bienveillant, direct, sans jargon. Utilise le tutoiement. Aucun préambule ni disclaimer. Français.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 600,
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }] }),
  });
  const data = await response.json();
  const text = (data.content || []).map((i) => (i.type === "text" ? i.text : "")).join("").trim();
  return text;
}

async function estimateFromText(txt) {
  const prompt = `Tu es nutritionniste. La personne décrit ce qu'elle a mangé. Découpe en aliments distincts avec leur quantité en grammes.
Réponds UNIQUEMENT en JSON (aucun texte, pas de Markdown) :
[{"nom":"Skyr nature","grams":200,"kcal":126,"p":22,"c":8,"f":0.4,"fib":0,"suc":8}]
Règles : "grams" = quantité en grammes (convertis les unités : 1 c. à soupe d'huile ≈ 14 g, 1 c. à café ≈ 5 g) ; "kcal","p","c","f","fib" (fibres),"suc" (sucres) = valeurs pour CETTE portion (pas pour 100 g) ; noms génériques simples, et précise « cru/sec » ou « cuit » quand c'est pertinent (pâtes, riz, légumineuses). Si rien d'exploitable, renvoie [].
Texte : "${(txt || "").replace(/"/g, "'")}"`;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: [{ type: "text", text: prompt }] }] }),
  });
  const data = await response.json();
  const text = (data.content || []).map((i) => (i.type === "text" ? i.text : "")).join("").trim();
  const arr = JSON.parse(text.replace(/```json|```/g, "").trim());
  return Array.isArray(arr) ? arr : [];
}
function matchList(catalog, nom) {
  const q = norm(nom);
  if (!q) return null;
  const exact = catalog.find((f) => norm(f.nom) === q);
  if (exact) return exact;
  const qw = q.split(/\s+/).filter((w) => w.length >= 3);
  let best = null, bestScore = 0;
  for (const f of catalog) {
    const fn = norm(f.nom);
    const fw = fn.split(/\s+/).filter(Boolean);
    let score = 0;
    for (const w of qw) if (fw.some((x) => x === w || x.startsWith(w) || w.startsWith(x))) score += 2;
    if (fn.includes(q)) score += 3;
    else if (q.includes(fn) && fn.length >= 4) score += 1;
    if (score > bestScore) { bestScore = score; best = f; }
  }
  return bestScore >= 2 ? best : null;
}
const SRC_TAG = {
  officiel: { t: "✓ liste officielle", c: "#2C6E49", b: "#EAF1EB" },
  perso: { t: "✓ ta liste", c: "#2F80B5", b: "#E7F0F7" },
  ia: { t: "≈ estimé par IA", c: "#B26A00", b: "#FCF3E6" },
};

function FreeTextEntry({ catalog, date, onClose, onAddMany, initialRepas }) {
  const [repas, setRepas] = useState(initialRepas || "soir");
  const [txt, setTxt] = useState("");
  const [status, setStatus] = useState("idle"); // idle, analyzing, done, empty, error
  const [items, setItems] = useState([]);

  async function analyze() {
    if (!txt.trim()) return;
    setStatus("analyzing");
    try {
      const res = await estimateFromText(txt);
      if (!res.length) { setStatus("empty"); return; }
      setItems(res.map((it) => {
        const g = Math.round(it.grams) || 100;
        const hit = matchList(catalog, it.nom);
        if (hit) {
          const officiel = FOODS.some((f) => f.id === hit.id);
          return { id: uid(), nom: hit.nom, grams: g, kpg: hit.kcal / 100, ppg: hit.p / 100, cpg: hit.c / 100, fpg: hit.f / 100, fibpg: (hit.fib || 0) / 100, sucpg: (hit.suc || 0) / 100, source: officiel ? "officiel" : "perso" };
        }
        return { id: uid(), nom: it.nom || "Aliment", grams: g, kpg: (it.kcal || 0) / g, ppg: (it.p || 0) / g, cpg: (it.c || 0) / g, fpg: (it.f || 0) / g, fibpg: (it.fib || 0) / g, sucpg: (it.suc || 0) / g, source: "ia" };
      }));
      setStatus("done");
    } catch (e) { setStatus("error"); }
  }

  const total = Math.round(items.reduce((a, it) => a + it.kpg * it.grams, 0));
  const aIA = items.some((it) => it.source === "ia");
  function addAll() {
    if (!items.length) return;
    onAddMany(items.map((it) => ({ id: uid(), repas, nom: it.nom, grams: it.grams, kcal: it.kpg * it.grams, p: it.ppg * it.grams, c: it.cpg * it.grams, f: it.fpg * it.grams, fib: (it.fibpg || 0) * it.grams, suc: (it.sucpg || 0) * it.grams })));
    onClose();
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={S.sheetGrab} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>✍️ Saisie libre</div>
          <button style={S.del} onClick={onClose}>×</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {REPAS.map((r) => (
            <button key={r.id} onClick={() => setRepas(r.id)} style={{ ...S.chip, ...(repas === r.id ? S.chipOn : {}) }}>{r.label}</button>
          ))}
        </div>

        <div style={{ ...S.miniMuted, marginBottom: 10, background: "#EAF1EB", borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>
          Écris librement ton repas. L'app cherche d'abord chaque aliment dans la <b>liste officielle</b> (valeurs de référence vérifiées). Ce qui n'y figure pas est <b>estimé par l'IA</b> — clairement indiqué, et <b>non ajouté</b> à la liste.
        </div>

        <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={3}
          placeholder="Ex : 200g de skyr + 20g de pépites de chocolat + 20g de fibres"
          style={{ ...S.input, resize: "vertical", fontFamily: "inherit", lineHeight: 1.4 }} />

        {status !== "done" && (
          <button onClick={analyze} disabled={status === "analyzing"}
            style={{ ...S.primaryBtn, opacity: status === "analyzing" ? 0.6 : 1 }}>
            {status === "analyzing" ? "Analyse en cours…" : "Analyser"}
          </button>
        )}
        {status === "empty" && <div style={{ ...S.miniMuted, textAlign: "center", padding: 8, color: C.red }}>Rien d'exploitable. Précise les quantités (ex : « 150g de riz »).</div>}
        {status === "error" && <div style={{ ...S.miniMuted, textAlign: "center", padding: 8, color: C.red }}>Analyse indisponible ici (réseau IA bloqué dans l'aperçu). Fonctionnera dans l'app déployée.</div>}

        {status === "done" && (
          <div>
            <div style={{ ...S.sectionLabel, marginTop: 12 }}>Résultat ({total} kcal)</div>
            {items.map((it) => {
              const tag = SRC_TAG[it.source];
              return (
                <div key={it.id} style={S.entryRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input value={it.nom} onChange={(e) => setItems((x) => x.map((y) => y.id === it.id ? { ...y, nom: e.target.value } : y))}
                      style={{ border: "none", background: "none", fontWeight: 600, fontSize: 14, width: "100%", outline: "none", color: C.ink }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: tag.c, background: tag.b, borderRadius: 6, padding: "2px 6px" }}>{tag.t}</span>
                      <span style={S.miniMuted}>{Math.round(it.kpg * it.grams)} kcal</span>
                    </div>
                  </div>
                  <input type="number" value={it.grams}
                    onChange={(e) => setItems((x) => x.map((y) => y.id === it.id ? { ...y, grams: Number(e.target.value) } : y))}
                    style={{ ...S.input, width: 64, padding: "6px 8px", textAlign: "right" }} />
                  <span style={{ ...S.miniMuted, marginLeft: 4 }}>g</span>
                  <button style={{ ...S.del, marginLeft: 6 }} onClick={() => setItems((x) => x.filter((y) => y.id !== it.id))}>×</button>
                </div>
              );
            })}
            {aIA && (
              <div style={{ ...S.miniMuted, marginTop: 10, background: "#FCF3E6", borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>
                Les lignes « ≈ estimé par IA » ne sont pas dans la liste officielle : vérifie-les, et ajoute à la main l'huile ou les sauces éventuelles. Elles ne seront pas enregistrées dans la liste.
              </div>
            )}
            <button style={S.primaryBtn} onClick={addAll}>Ajouter au repas</button>
            <button style={{ ...S.linkBtn, display: "block", margin: "10px auto 0" }} onClick={() => { setStatus("idle"); setItems([]); }}>modifier le texte</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoEstimate({ date, onClose, onAddMany, initialRepas }) {
  const [repas, setRepas] = useState(initialRepas || "soir");
  const [status, setStatus] = useState("idle"); // idle, analyzing, done, empty, error
  const [items, setItems] = useState([]);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  function onFile(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        const max = 700, scale = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = img.width * scale; cv.height = img.height * scale;
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        const dataUrl = cv.toDataURL("image/jpeg", 0.7);
        setPreview(dataUrl); setStatus("analyzing");
        try {
          const res = await estimateFromPhoto(dataUrl.split(",")[1], "image/jpeg");
          if (!res.length) { setStatus("empty"); return; }
          setItems(res.map((it) => {
            const g = Math.round(it.grams) || 100;
            return { id: uid(), nom: it.nom || "Aliment", grams: g, kpg: (it.kcal || 0) / g, ppg: (it.p || 0) / g, cpg: (it.c || 0) / g, fpg: (it.f || 0) / g, fibpg: (it.fib || 0) / g, sucpg: (it.suc || 0) / g };
          }));
          setStatus("done");
        } catch { setStatus("error"); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  const total = Math.round(items.reduce((a, it) => a + it.kpg * it.grams, 0));
  function addAll() {
    if (!items.length) return;
    onAddMany(items.map((it) => ({ id: uid(), repas, nom: it.nom, grams: it.grams, kcal: it.kpg * it.grams, p: it.ppg * it.grams, c: it.cpg * it.grams, f: it.fpg * it.grams, fib: (it.fibpg || 0) * it.grams, suc: (it.sucpg || 0) * it.grams })));
    onClose();
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={S.sheetGrab} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>📸 Estimer par photo</div>
          <button style={S.del} onClick={onClose}>×</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {REPAS.map((r) => (
            <button key={r.id} onClick={() => setRepas(r.id)} style={{ ...S.chip, ...(repas === r.id ? S.chipOn : {}) }}>{r.label}</button>
          ))}
        </div>

        {status === "idle" && (
          <label style={{ display: "block", width: "100%", padding: "16px 0", borderRadius: 12, border: "1px dashed #C7D2C6", background: "#FAFBF8", color: C.green, fontWeight: 700, fontSize: 15, cursor: "pointer", textAlign: "center", boxSizing: "border-box" }}>
            📷 Prendre / choisir une photo
            <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
          </label>
        )}

        {preview && status !== "idle" && (
          <img src={preview} alt="" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginBottom: 10 }} />
        )}

        {status === "analyzing" && <div style={{ ...S.miniMuted, textAlign: "center", padding: 10 }}>Analyse du repas par l'IA…</div>}
        {status === "empty" && <div style={{ ...S.miniMuted, textAlign: "center", padding: 10, color: C.red }}>Aucun aliment reconnu. Réessaie avec une photo plus nette, ou encode à la main.</div>}
        {status === "error" && <div style={{ ...S.miniMuted, textAlign: "center", padding: 10, color: C.red }}>Estimation indisponible ici (réseau IA bloqué dans l'aperçu). Fonctionnera dans l'app déployée ; en attendant, encode à la main.</div>}

        {status === "done" && (
          <div>
            <div style={{ ...S.sectionLabel, marginTop: 4 }}>Estimation ({total} kcal) — ajuste si besoin</div>
            {items.map((it) => (
              <div key={it.id} style={S.entryRow}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input value={it.nom} onChange={(e) => setItems((x) => x.map((y) => y.id === it.id ? { ...y, nom: e.target.value } : y))}
                    style={{ border: "none", background: "none", fontWeight: 600, fontSize: 14, width: "100%", outline: "none", color: C.ink }} />
                  <div style={S.miniMuted}>{Math.round(it.kpg * it.grams)} kcal</div>
                </div>
                <input type="number" value={it.grams}
                  onChange={(e) => setItems((x) => x.map((y) => y.id === it.id ? { ...y, grams: Number(e.target.value) } : y))}
                  style={{ ...S.input, width: 64, padding: "6px 8px", textAlign: "right" }} />
                <span style={{ ...S.miniMuted, marginLeft: 4 }}>g</span>
                <button style={{ ...S.del, marginLeft: 6 }} onClick={() => setItems((x) => x.filter((y) => y.id !== it.id))}>×</button>
              </div>
            ))}

            <div style={{ ...S.miniMuted, marginTop: 10, background: "#FCF3E6", borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>
              ⚠️ Pour plus de précision, complète toujours la photo par des <b>données manuelles</b> : corrige les portions ci-dessus, et surtout ajoute à la main l'<b>huile, le beurre et les sauces</b> — souvent invisibles sur la photo, ils pèsent 100 à 400 kcal. La photo est un point de départ rapide, pas un chiffre exact.
            </div>

            <button style={S.primaryBtn} onClick={addAll}>Ajouter au repas</button>
            <button style={{ ...S.linkBtn, display: "block", margin: "10px auto 0" }} onClick={() => { setStatus("idle"); setItems([]); setPreview(null); }}>reprendre une photo</button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddSheet({ catalog, date, onClose, onAdd, onCreateFood, diary, favMeals, onAddFavorite, onDeleteFavorite, onAddMany, initialRepas }) {
  const [repas, setRepas] = useState(initialRepas || "soir");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [grams, setGrams] = useState(150);
  const [photo, setPhoto] = useState(null);
  const [memoOpen, setMemoOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [nf, setNf] = useState({ grp: "proteine" });
  const [scanOpen, setScanOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [freeOpen, setFreeOpen] = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const [thanksMsg, setThanksMsg] = useState("");
  const fileRef = useRef();

  function startCreate() { setNf({ nom: q, grp: "proteine" }); setCreating(true); }
  function saveNew() {
    if (!nf.nom || !nf.kcal) return;
    const food = onCreateFood(nf);
    setSel(food); setQ(food.nom); setCreating(false);
    setThanksMsg(nf.code
      ? "✨ Merci ! Ce produit rejoint la base commune — chaque autre utilisateur y a maintenant accès."
      : "✨ Merci ! Ton aliment rejoint la base commune — il profite à tous.");
    setTimeout(() => setThanksMsg(""), 4200);
  }

  const nq = norm(q);
  const liste = catalog.filter((f) => norm(f.nom).includes(nq));
  const recents = useMemo(() => {
    const seen = [];
    const dates = Object.keys(diary || {}).sort().reverse();
    for (const d of dates) {
      for (const e of (diary[d] || [])) {
        if (!seen.includes(e.foodId) && catalog.find((f) => f.id === e.foodId)) seen.push(e.foodId);
      }
      if (seen.length >= 10) break;
    }
    return seen.slice(0, 10).map((id) => catalog.find((f) => f.id === id)).filter(Boolean);
  }, [diary, catalog]);
  const calc = sel ? { kcal: (sel.kcal * grams) / 100, p: (sel.p * grams) / 100, c: (sel.c * grams) / 100, f: (sel.f * grams) / 100, fib: ((sel.fib || 0) * grams) / 100, suc: ((sel.suc || 0) * grams) / 100 } : null;

  function valider() {
    if (!sel) return;
    onAdd({ id: uid(), repas, foodId: sel.id, nom: sel.nom, grams: Number(grams), ...calc, photo });
    onClose();
  }
  function validerContinue() {
    if (!sel) return;
    onAdd({ id: uid(), repas, foodId: sel.id, nom: sel.nom, grams: Number(grams), ...calc, photo });
    setAddedCount((n) => n + 1);
    setSel(null); setQ(""); setGrams(150); setPhoto(null);
  }
  function onPhoto(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 420, scale = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = img.width * scale; cv.height = img.height * scale;
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        setPhoto(cv.toDataURL("image/jpeg", 0.55));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={S.sheetGrab} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>
            Ajouter · {jolieDate(date)}
            {addedCount > 0 && <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: "#fff", background: C.green, borderRadius: 10, padding: "2px 8px" }}>{addedCount} ajouté{addedCount > 1 ? "s" : ""}</span>}
            {thanksMsg && <div style={{ fontSize: 12, color: C.accent, background: C.accentTint, padding: "6px 10px", marginTop: 8, lineHeight: 1.4, fontWeight: 600 }}>{thanksMsg}</div>}
          </div>
          <button style={S.del} onClick={onClose}>{addedCount > 0 ? "Terminé" : "×"}</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {REPAS.map((r) => (
            <button key={r.id} onClick={() => setRepas(r.id)}
              style={{ ...S.chip, ...(repas === r.id ? S.chipOn : {}) }}>{r.label}</button>
          ))}
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 12, marginBottom: 12 }}>
          <button onClick={() => setMemoOpen((o) => !o)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, color: C.ink, fontSize: 14, fontWeight: 600 }}>
            <span>🥄 Équivalences sans balance</span>
            <span style={{ fontSize: 20, color: C.green }}>{memoOpen ? "−" : "+"}</span>
          </button>
          {memoOpen && (
            <div style={{ marginTop: 8 }}>
              {MEMO.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #F0F2ED", fontSize: 13 }}>
                  <span>{k}</span><span style={{ fontWeight: 700, color: C.green }}>{v}</span>
                </div>
              ))}
              <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 6 }}>
                Huile & beurre plus légers : 1 c. à soupe ≈ 10 g.
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setScanOpen(true)}
          style={{ width: "100%", marginBottom: 10, padding: "12px 0", borderRadius: 12, border: "none", background: C.ink, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          📷 Scanner un code-barres
        </button>
        <button onClick={() => setPhotoOpen(true)}
          style={{ width: "100%", marginBottom: 10, padding: "12px 0", borderRadius: 12, border: "none", background: "#6B4EA8", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          📸 Estimer par photo (IA)
        </button>
        <button onClick={() => setFreeOpen(true)}
          style={{ width: "100%", marginBottom: 10, padding: "12px 0", borderRadius: 12, border: "none", background: "#2F80B5", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          ✍️ Saisie libre (IA + liste)
        </button>
        {scanOpen && (
          <Scanner onClose={() => setScanOpen(false)}
            onResult={(prod) => { setNf({ ...prod }); setCreating(true); setSel(null); setScanOpen(false); }} />
        )}
        {photoOpen && (
          <PhotoEstimate date={date} initialRepas={repas} onClose={() => setPhotoOpen(false)}
            onAddMany={(entries) => { onAddMany(entries); setPhotoOpen(false); onClose(); }} />
        )}
        {freeOpen && (
          <FreeTextEntry catalog={catalog} date={date} initialRepas={repas} onClose={() => setFreeOpen(false)}
            onAddMany={(entries) => { onAddMany(entries); setFreeOpen(false); onClose(); }} />
        )}
        <input style={S.input} placeholder="Rechercher un aliment…" value={q}
          onChange={(e) => { setQ(e.target.value); setSel(null); }} />

        {creating ? (
          <div style={{ marginTop: 12 }}>
            <div style={S.sectionLabel}>Nouveau plat / aliment (valeurs pour 100 g)</div>
            <input style={{ ...S.input, marginBottom: 8 }} placeholder="Nom du plat"
              value={nf.nom || ""} onChange={(e) => setNf({ ...nf, nom: e.target.value })} />
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <NumIn label="kcal" v={nf.kcal} on={(v) => setNf({ ...nf, kcal: v })} />
              <NumIn label="Prot." v={nf.p} on={(v) => setNf({ ...nf, p: v })} />
              <NumIn label="Gluc." v={nf.c} on={(v) => setNf({ ...nf, c: v })} />
              <NumIn label="Lip." v={nf.f} on={(v) => setNf({ ...nf, f: v })} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {GRP_ORDER.map((g) => (
                <button key={g} onClick={() => setNf({ ...nf, grp: g })}
                  style={{ ...S.chip, padding: "6px 10px", fontSize: 12, ...(nf.grp === g ? S.chipOn : {}) }}>
                  {GROUPES[g].label}
                </button>
              ))}
            </div>
            <button style={{ ...S.primaryBtn, marginTop: 0 }} onClick={saveNew}>Créer et sélectionner</button>
            <button style={{ ...S.linkBtn, display: "block", margin: "10px auto 0" }} onClick={() => setCreating(false)}>annuler</button>
            <div style={{ ...S.miniMuted, fontSize: 11, textAlign: "center", marginTop: 8 }}>
              Il sera aussi enregistré dans ta Liste.
            </div>
          </div>
        ) : !sel ? (
          <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 8 }}>
            {!nq && favMeals.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={S.sectionLabel}>Repas enregistrés → {(REPAS.find((r) => r.id === repas) || {}).label}</div>
                {favMeals.map((fav) => (
                  <div key={fav.id} style={S.entryRow}>
                    <button onClick={() => { onAddFavorite(fav, repas); onClose(); }}
                      style={{ flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.green }}>★ {fav.nom}</div>
                      <div style={S.miniMuted}>{fav.items.length} aliments · {Math.round(fav.items.reduce((a, i) => a + i.kcal, 0))} kcal</div>
                    </button>
                    <button style={S.del} onClick={() => onDeleteFavorite(fav.id)}>×</button>
                  </div>
                ))}
              </div>
            )}
            {!nq && recents.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={S.sectionLabel}>Récents</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {recents.map((f) => (
                    <button key={f.id} onClick={() => { setSel(f); setQ(f.nom); }}
                      style={{ ...S.chip, padding: "7px 10px", fontSize: 13 }}>{f.nom}</button>
                  ))}
                </div>
              </div>
            )}
            {(!nq && (favMeals.length > 0 || recents.length > 0)) && <div style={S.sectionLabel}>Tous les aliments</div>}
            {liste.map((f) => (
              <button key={f.id} onClick={() => { setSel(f); setQ(f.nom); if (PORT[f.id]) setGrams(PORT[f.id][0].g); }} style={S.foodRow}>
                <span style={{ ...S.dot, background: GROUPES[f.grp].couleur }} />
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span style={{ fontSize: 14, display: "block" }}>
                    {f.nom}
                    {PORT[f.id] && <span style={{ color: C.muted, fontWeight: 500, marginLeft: 6 }}>({PORT[f.id][0].l} = {PORT[f.id][0].g} g)</span>}
                  </span>
                </span>
                <span style={S.miniMuted}>{f.kcal} kcal/100g</span>
              </button>
            ))}
            {!liste.length && <div style={{ ...S.miniMuted, padding: "8px 8px 4px" }}>Aucun résultat dans ta liste.</div>}
            <button onClick={startCreate}
              style={{ width: "100%", marginTop: 10, padding: "12px 0", borderRadius: 12, border: "1px dashed #C7D2C6", background: "#FAFBF8", color: C.green, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              ＋ Créer {q ? `« ${q} »` : "un nouvel aliment"}
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 12 }}>
            {PORT[sel.id] && (
              <div style={{ marginBottom: 12 }}>
                <div style={S.sectionLabel}>Sans balance ? Portions courantes</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PORT[sel.id].map((pt) => (
                    <button key={pt.l} onClick={() => setGrams(pt.g)}
                      style={{ ...S.chip, padding: "8px 12px", fontSize: 13, ...(grams === pt.g ? S.chipOn : {}) }}>
                      {pt.l} · {pt.g} g
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={S.sectionLabel}>Quantité : {grams} g</div>
            <input type="range" min="10" max="500" step="5" value={grams}
              onChange={(e) => setGrams(Number(e.target.value))} style={{ width: "100%", accentColor: C.green }} />
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[50, 100, 150, 200].map((g) => <button key={g} onClick={() => setGrams(g)} style={S.qBtn}>{g}g</button>)}
            </div>
            <div style={S.calcBox}>
              <div><b style={{ fontSize: 22, color: C.ink }}>{Math.round(calc.kcal)}</b> kcal</div>
              <div style={S.miniMuted}>P {calc.p.toFixed(1)} · G {calc.c.toFixed(1)} · L {calc.f.toFixed(1)}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
              {photo && <img src={photo} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />}
              <label style={{ ...S.photoBtn, display: "block", textAlign: "center", boxSizing: "border-box" }}>
                {photo ? "Changer la photo" : "📷 Photo"}
                <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...S.primaryBtn, flex: 1 }} onClick={valider}>Ajouter</button>
              <button style={{ ...S.primaryBtn, flex: 1, background: "#fff", color: C.green, border: `2px solid ${C.green}` }} onClick={validerContinue}>+ et continuer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================= SHEET ÉDITION ======================= */
function EditSheet({ entry, catalog, onClose, onSave }) {
  const [grams, setGrams] = useState(entry.grams);
  const food = catalog.find((f) => f.id === entry.foodId);
  const per = food || {
    kcal: entry.kcal / entry.grams * 100, p: entry.p / entry.grams * 100,
    c: entry.c / entry.grams * 100, f: entry.f / entry.grams * 100,
  };
  const kcal = Math.round(per.kcal * grams / 100);
  const portions = PORT[entry.foodId];
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={S.sheetGrab} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>Modifier · {entry.nom}</div>
          <button style={S.del} onClick={onClose}>×</button>
        </div>
        {portions && (
          <div style={{ marginBottom: 12 }}>
            <div style={S.sectionLabel}>Portions courantes</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {portions.map((pt) => (
                <button key={pt.l} onClick={() => setGrams(pt.g)}
                  style={{ ...S.chip, padding: "8px 12px", fontSize: 13, ...(grams === pt.g ? S.chipOn : {}) }}>{pt.l} · {pt.g} g</button>
              ))}
            </div>
          </div>
        )}
        <div style={S.sectionLabel}>Quantité : {grams} g</div>
        <input type="range" min="10" max="500" step="5" value={grams}
          onChange={(e) => setGrams(Number(e.target.value))} style={{ width: "100%", accentColor: C.green }} />
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {[50, 100, 150, 200].map((g) => <button key={g} onClick={() => setGrams(g)} style={S.qBtn}>{g}g</button>)}
        </div>
        <div style={S.calcBox}><div><b style={{ fontSize: 22, color: C.ink }}>{kcal}</b> kcal</div></div>
        <button style={S.primaryBtn} onClick={() => onSave(grams)}>Enregistrer</button>
      </div>
    </div>
  );
}

/* ========================= SHEET SPORT ========================= */
function SportSheet({ sports, poids, date, onClose, onAdd, onCreate }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [min, setMin] = useState(60);
  const [creating, setCreating] = useState(false);
  const [nf, setNf] = useState({});
  const [override, setOverride] = useState("");
  const [photo, setPhoto] = useState(null);
  const photoRef = useRef();

  const liste = sports.filter((s) => norm(s.nom).includes(norm(q)));
  const kcalH = sel ? (sel.kcalH != null ? sel.kcalH : kcalPerH(sel.met, poids)) : 0;
  const kcalAuto = Math.round((kcalH * min) / 60);
  const kcal = override !== "" ? Math.max(0, Math.round(Number(override) || 0)) : kcalAuto;

  function onPhoto(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 520, scale = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = img.width * scale; cv.height = img.height * scale;
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        setPhoto(cv.toDataURL("image/jpeg", 0.6));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function valider() {
    if (!sel) return;
    onAdd({ id: uid(), sportId: sel.id, nom: sel.nom, minutes: Number(min), kcal, photo });
    onClose();
  }
  function startCreate() { setNf({ nom: q }); setCreating(true); }
  function saveNew() {
    if (!nf.nom || !nf.kcalH) return;
    const s = onCreate(nf); setSel(s); setQ(s.nom); setCreating(false);
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={S.sheetGrab} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>🏃 Sport · {jolieDate(date)}</div>
          <button style={S.del} onClick={onClose}>×</button>
        </div>

        {creating ? (
          <div>
            <div style={S.sectionLabel}>Nouveau sport</div>
            <input style={{ ...S.input, marginBottom: 8 }} placeholder="Nom de l'activité"
              value={nf.nom || ""} onChange={(e) => setNf({ ...nf, nom: e.target.value })} />
            <NumIn label="kcal par heure" v={nf.kcalH} on={(v) => setNf({ ...nf, kcalH: v })} />
            <button style={{ ...S.primaryBtn }} onClick={saveNew}>Créer et sélectionner</button>
            <button style={{ ...S.linkBtn, display: "block", margin: "10px auto 0" }} onClick={() => setCreating(false)}>annuler</button>
          </div>
        ) : !sel ? (
          <>
            <input style={S.input} placeholder="Rechercher une activité…" value={q}
              onChange={(e) => setQ(e.target.value)} />
            <div style={{ maxHeight: 280, overflowY: "auto", marginTop: 8 }}>
              {liste.map((s) => (
                <button key={s.id} onClick={() => setSel(s)} style={S.foodRow}>
                  <span style={{ ...S.dot, background: "#3E9CA8" }} />
                  <span style={{ flex: 1, textAlign: "left", fontSize: 14 }}>{s.nom}</span>
                  <span style={S.miniMuted}>{s.kcalH != null ? s.kcalH : kcalPerH(s.met, poids)} kcal/h</span>
                </button>
              ))}
              <button onClick={startCreate}
                style={{ width: "100%", marginTop: 10, padding: "12px 0", borderRadius: 12, border: "1px dashed #A9CBD1", background: "#F5FAFB", color: "#2C7A86", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                ＋ Créer {q ? `« ${q} »` : "un sport"}
              </button>
            </div>
          </>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>{sel.nom}</span>
              <button style={S.linkBtn} onClick={() => setSel(null)}>changer</button>
            </div>
            <div style={{ ...S.miniMuted, marginTop: 2 }}>{kcalH} kcal/h pour {poids} kg</div>
            <div style={{ ...S.sectionLabel, marginTop: 12 }}>Durée : {min} min</div>
            <input type="range" min="10" max="180" step="5" value={min}
              onChange={(e) => setMin(Number(e.target.value))} style={{ width: "100%", accentColor: "#3E9CA8" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[30, 45, 60, 90].map((m) => (
                <button key={m} onClick={() => setMin(m)} style={S.qBtn}>{m} min</button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF5F6", borderRadius: 12, padding: "12px 14px", marginTop: 12 }}>
              <span><b style={{ fontSize: 22, color: C.ink }}>{kcal}</b> kcal dépensées</span>
              <span style={{ ...S.miniMuted, fontSize: 11 }}>{override !== "" ? "valeur manuelle" : "estimé"}</span>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={S.sectionLabel}>Corriger les kcal (optionnel)</div>
              <div style={{ ...S.miniMuted, fontSize: 11, marginBottom: 6 }}>
                Si ta montre / Strava t'indique une valeur plus précise, remplace ici.
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" placeholder={`estimé ${kcalAuto}`} value={override}
                  onChange={(e) => setOverride(e.target.value)}
                  style={{ ...S.input, flex: 1 }} />
                <span style={{ fontWeight: 700 }}>kcal</span>
                {override !== "" && (
                  <button onClick={() => setOverride("")}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #E1E6DC", background: "#fff", cursor: "pointer", fontSize: 12 }}>×</button>
                )}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={S.sectionLabel}>Preuve / capture (optionnel)</div>
              <div style={{ ...S.miniMuted, fontSize: 11, marginBottom: 6 }}>
                Attache une capture de ta séance (Strava, montre) pour la garder en mémoire.
              </div>
              {photo ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={photo} alt="" style={{ maxWidth: 160, maxHeight: 160, borderRadius: 10, display: "block" }} />
                  <button onClick={() => setPhoto(null)}
                    style={{ position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: 12, border: "none", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", cursor: "pointer" }}>×</button>
                </div>
              ) : (
                <>
                  <button onClick={() => photoRef.current && photoRef.current.click()}
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px dashed #A9CBD1", background: "#F5FAFB", color: "#2C7A86", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    📷 Ajouter une capture
                  </button>
                  <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onPhoto} />
                </>
              )}
            </div>

            <button style={{ ...S.primaryBtn, background: "#3E9CA8" }} onClick={valider}>Enregistrer l'activité</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================= LISTE ============================= */
function Liste({ catalog, customFoods, setCustomFoods, customSports, setCustomSports, poids, favMeals, onDeleteFavorite, onRenameFavorite, onUpdateFavorite, habitudes = [], setHabitudes, sharedCount = 0, totalCount = 0 }) {
  const [view, setView] = useState("aliments");
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null);
  const [sportForm, setSportForm] = useState(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({}); // {g: true} = déplié

  const filtered = catalog.filter((f) => norm(f.nom).includes(norm(q)));
  const parGroupe = GRP_ORDER.map((g) => ({ g, items: filtered.filter((f) => f.grp === g) })).filter((x) => x.items.length);
  const sports = [...SPORTS, ...customSports];

  function ajouter() {
    if (!form || !form.nom || !form.kcal) return;
    const food = {
      id: "u_" + uid(), nom: form.nom, grp: form.grp || "extra",
      kcal: Number(form.kcal), p: Number(form.p) || 0, c: Number(form.c) || 0, f: Number(form.f) || 0,
      fib: Number(form.fib) || 0, suc: Number(form.suc) || 0,
      code: form.code || null,
    };
    setCustomFoods((cf) => [...cf, food]);
    // Contribue à la base partagée
    if (typeof window !== "undefined" && window.NUTRI_SHARED_FOODS) {
      const code = food.code || `enc_${norm(food.nom).replace(/\s+/g, "_").slice(0, 40)}`;
      window.NUTRI_SHARED_FOODS.submit({ code, nom: food.nom, grp: food.grp,
        kcal: food.kcal, p: food.p, c: food.c, f: food.f, fib: food.fib, suc: food.suc,
        source: food.code ? "scan" : "encoded" });
    }
    setForm(null);
  }
  function supprimer(id) { setCustomFoods((cf) => cf.filter((f) => f.id !== id)); }
  function ajouterSport() {
    if (!sportForm || !sportForm.nom || !sportForm.kcalH) return;
    setCustomSports((cs) => [...cs, { id: "us_" + uid(), nom: sportForm.nom, kcalH: Number(sportForm.kcalH) }]);
    setSportForm(null);
  }
  function supprimerSport(id) { setCustomSports((cs) => cs.filter((s) => s.id !== id)); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, padding: "0 4px", flexWrap: "wrap" }}>
        {[["aliments", "Aliments"], ["recettes", "Recettes"], ["habitudes", "Habitudes"], ["partages", "Repas partagés"], ["sport", "Sport"], ["favoris", "Favoris"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{ ...S.tabPill, ...(view === k ? S.tabPillOn : {}) }}>{l}</button>
        ))}
      </div>

      {view === "aliments" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 4px", flexWrap: "wrap" }}>
            <button style={{ ...S.addSmall, background: C.ink }} onClick={() => setScanOpen(true)}>
              📷 Scanner un code-barres
            </button>
            <button style={S.addSmall} onClick={() => setForm(form ? null : { grp: "proteine" })}>
              {form ? "Fermer" : "＋ Nouvel aliment"}
            </button>
          </div>

          {scanOpen && (
            <Scanner onClose={() => setScanOpen(false)}
              onResult={(prod) => { setForm({ ...prod, grp: prod.grp || "plat" }); setScanOpen(false); }} />
          )}

          {/* Banner communauté : base commune qui grossit */}
          <div style={{ background: C.accentTint, border: `2px solid ${C.accent}`, padding: "14px 16px", marginBottom: 6 }}>
            <div style={{ ...S.kicker, color: C.accent, marginBottom: 6 }}>BASE COMMUNAUTAIRE</div>
            <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>
              <b style={{ fontSize: 22, fontWeight: 800, color: C.accent, letterSpacing: "-0.02em", marginRight: 4 }}>{totalCount.toLocaleString("fr-BE")}</b>
              aliments dans ta liste{sharedCount > 0 && <> · dont <b>{sharedCount.toLocaleString("fr-BE")} scannés par la communauté</b></>}.
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.55 }}>
              Chaque code-barres que tu scannes ou aliment que tu encodes rejoint la base commune — <b>ta contribution enrichit la liste de tous</b>.
            </div>
          </div>


          {form && (
            <div style={S.card}>
              <div style={S.sectionLabel}>Créer un aliment (valeurs pour 100 g)</div>
              <input style={{ ...S.input, marginBottom: 8 }} placeholder="Nom (ex : Lasagne surgelée)"
                value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <NumIn label="kcal" v={form.kcal} on={(v) => setForm({ ...form, kcal: v })} />
                <NumIn label="Prot." v={form.p} on={(v) => setForm({ ...form, p: v })} />
                <NumIn label="Gluc." v={form.c} on={(v) => setForm({ ...form, c: v })} />
                <NumIn label="Lip." v={form.f} on={(v) => setForm({ ...form, f: v })} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <NumIn label="Fibres (opt.)" v={form.fib} on={(v) => setForm({ ...form, fib: v })} />
                <NumIn label="Sucres (opt.)" v={form.suc} on={(v) => setForm({ ...form, suc: v })} />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {GRP_ORDER.map((g) => (
                  <button key={g} onClick={() => setForm({ ...form, grp: g })}
                    style={{ ...S.chip, padding: "6px 10px", fontSize: 12, ...(form.grp === g ? S.chipOn : {}) }}>
                    {GROUPES[g].label}
                  </button>
                ))}
              </div>
              <button style={{ ...S.primaryBtn, marginTop: 0 }} onClick={ajouter}>Enregistrer dans ma liste</button>
            </div>
          )}

          <div style={{ ...S.miniMuted, fontSize: 12, marginBottom: -4, padding: "0 2px", lineHeight: 1.5 }}>
            Liste officielle : valeurs de référence vérifiées. Les aliments que tu crées apparaissent avec le badge <b>perso</b>.
          </div>
          <input style={S.input} placeholder="Filtrer…" value={q} onChange={(e) => setQ(e.target.value)} />

          {parGroupe.map(({ g, items }) => {
            // Si recherche active, on force l'affichage ; sinon on respecte l'état d'ouverture.
            const forceOpen = q.trim().length > 0;
            const open = forceOpen || !!openGroups[g];
            return (
              <div key={g} style={S.cardFramed}>
                <button
                  onClick={() => setOpenGroups((o) => ({ ...o, [g]: !o[g] }))}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Archivo', sans-serif" }}>
                  <span style={{ ...S.dot, background: C.accent }} />
                  <span style={{ flex: 1, textAlign: "left", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: C.ink }}>
                    {GROUPES[g].label}
                  </span>
                  <span style={{ ...S.miniMuted, fontSize: 12, fontWeight: 600 }}>{items.length}</span>
                  <span style={{ fontSize: 18, color: C.accent, width: 20, textAlign: "center", fontWeight: 700 }}>{open ? "−" : "+"}</span>
                </button>
                {open && items.map((f) => (
                  <div key={f.id} style={S.entryRow}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {f.nom}{f.id.startsWith("u_") && <span style={S.badge}>perso</span>}
                      </div>
                      <div style={S.miniMuted}>{f.kcal} kcal · P{f.p} G{f.c} L{f.f} /100g</div>
                    </div>
                    {f.id.startsWith("u_") && (
                      <>
                        <button style={S.favBtn} onClick={() => {
                          const n = (window.prompt("Renommer :", f.nom) || "").trim();
                          if (n && n !== f.nom) setCustomFoods((cf) => cf.map((x) => x.id === f.id ? { ...x, nom: n } : x));
                        }}>Renommer</button>
                        <button style={{ ...S.del, marginLeft: 6 }} onClick={() => supprimer(f.id)}>×</button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}

      {view === "sport" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
            <div style={{ ...S.miniMuted }}>Dépense estimée pour {poids} kg</div>
            <button style={{ ...S.addSmall, background: "#3E9CA8" }} onClick={() => setSportForm(sportForm ? null : {})}>
              {sportForm ? "Fermer" : "＋ Nouveau sport"}
            </button>
          </div>

          {sportForm && (
            <div style={S.card}>
              <div style={S.sectionLabel}>Créer un sport</div>
              <input style={{ ...S.input, marginBottom: 8 }} placeholder="Nom de l'activité"
                value={sportForm.nom || ""} onChange={(e) => setSportForm({ ...sportForm, nom: e.target.value })} />
              <NumIn label="kcal par heure" v={sportForm.kcalH} on={(v) => setSportForm({ ...sportForm, kcalH: v })} />
              <button style={{ ...S.primaryBtn }} onClick={ajouterSport}>Enregistrer</button>
            </div>
          )}

          <div style={S.card}>
            {sports.map((s) => (
              <div key={s.id} style={S.entryRow}>
                <span style={{ ...S.dot, background: "#3E9CA8" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {s.nom}{s.id.startsWith("us_") && <span style={S.badge}>perso</span>}
                  </div>
                </div>
                <span style={{ ...S.miniMuted, fontWeight: 700 }}>
                  {s.kcalH != null ? s.kcalH : kcalPerH(s.met, poids)} kcal/h
                </span>
                {s.id.startsWith("us_") && <button style={{ ...S.del, marginLeft: 8 }} onClick={() => supprimerSport(s.id)}>×</button>}
              </div>
            ))}
          </div>

          <div style={{ ...S.miniMuted, fontSize: 12, textAlign: "center", padding: "0 20px" }}>
            Les kcal/h se recalculent avec ton poids. Ce sont des estimations moyennes (METs) — les vraies dépenses varient selon l'intensité.
          </div>
        </>
      )}

      {view === "recettes" && (
        <RecettesView catalog={catalog} customFoods={customFoods} setCustomFoods={setCustomFoods} />
      )}

      {view === "habitudes" && (
        <HabitudesView habitudes={habitudes} setHabitudes={setHabitudes} catalog={catalog} />
      )}

      {view === "partages" && (
        <MealsFeed catalog={catalog} customFoods={customFoods} setCustomFoods={setCustomFoods} />
      )}

      {view === "favoris" && (
        <FavorisView favMeals={favMeals} onDelete={onDeleteFavorite} onRename={onRenameFavorite}
          onUpdate={onUpdateFavorite} catalog={catalog} />
      )}
    </div>
  );
}

function RecettesView({ catalog, customFoods, setCustomFoods }) {
  const [form, setForm] = useState(null); // { nom, portion, items: [{foodId, grams}], q, editingId }
  const recipes = customFoods.filter((f) => Array.isArray(f.ingredients) && f.ingredients.length);

  function startNew() {
    setForm({ nom: "", portion: 100, items: [], q: "", editingId: null });
  }
  function edit(rec) {
    setForm({ nom: rec.nom, portion: rec.portion || 100, items: rec.ingredients.map((i) => ({ ...i })), q: "", editingId: rec.id });
  }
  function suppr(id) {
    if (!window.confirm("Supprimer cette recette ?")) return;
    setCustomFoods((cf) => cf.filter((f) => f.id !== id));
  }
  function addIngredient(foodId) {
    setForm((f) => ({ ...f, items: [...f.items, { foodId, grams: 100 }], q: "" }));
  }
  function updateGrams(idx, g) {
    setForm((f) => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, grams: Number(g) || 0 } : it) }));
  }
  function removeIngredient(idx) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }
  function totalsFor(items) {
    return items.reduce((acc, it) => {
      const food = catalog.find((c) => c.id === it.foodId);
      if (!food) return acc;
      const g = Number(it.grams) || 0;
      const factor = g / 100;
      acc.grams += g;
      acc.kcal += (food.kcal || 0) * factor;
      acc.p += (food.p || 0) * factor;
      acc.c += (food.c || 0) * factor;
      acc.f += (food.f || 0) * factor;
      acc.fib += (food.fib || 0) * factor;
      acc.suc += (food.suc || 0) * factor;
      return acc;
    }, { grams: 0, kcal: 0, p: 0, c: 0, f: 0, fib: 0, suc: 0 });
  }

  function save() {
    if (!form.nom.trim()) { window.alert("Donne un nom à la recette."); return; }
    if (!form.items.length) { window.alert("Ajoute au moins un ingrédient."); return; }
    const tot = totalsFor(form.items);
    if (tot.grams <= 0) { window.alert("Poids total nul."); return; }
    const per100 = (v) => +(v * 100 / tot.grams).toFixed(1);
    const food = {
      id: form.editingId || "u_" + uid(),
      nom: form.nom.trim(),
      grp: "plat",
      kcal: Math.round(per100(tot.kcal)),
      p: per100(tot.p), c: per100(tot.c), f: per100(tot.f),
      fib: per100(tot.fib), suc: per100(tot.suc),
      ingredients: form.items.map((i) => ({ foodId: i.foodId, grams: Number(i.grams) || 0 })),
      portion: Number(form.portion) || Math.round(tot.grams),
    };
    setCustomFoods((cf) => form.editingId
      ? cf.map((f) => f.id === form.editingId ? food : f)
      : [...cf, food]);
    setForm(null);
  }

  const suggestions = form && form.q
    ? catalog.filter((f) => norm(f.nom).includes(norm(form.q))).slice(0, 8)
    : [];
  const tot = form ? totalsFor(form.items) : null;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 4px" }}>
        <button style={S.addSmall} onClick={() => form ? setForm(null) : startNew()}>
          {form ? "Fermer" : "＋ Nouvelle recette"}
        </button>
      </div>

      {form && (
        <div style={S.card}>
          <div style={S.sectionLabel}>{form.editingId ? "Modifier la recette" : "Composer une recette"}</div>
          <input style={{ ...S.input, marginBottom: 8 }} placeholder="Nom (ex : Bolognaise maison)"
            value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />

          <div style={{ ...S.miniMuted, marginTop: 6, marginBottom: 6 }}>Ingrédients</div>
          {form.items.map((it, i) => {
            const food = catalog.find((c) => c.id === it.foodId);
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ flex: 1, fontSize: 14 }}>{food ? food.nom : "?"}</div>
                <input type="number" value={it.grams} onChange={(e) => updateGrams(i, e.target.value)}
                  style={{ ...S.input, width: 80, padding: "8px 10px", margin: 0 }} />
                <span style={{ ...S.miniMuted, fontSize: 12 }}>g</span>
                <button style={S.del} onClick={() => removeIngredient(i)}>×</button>
              </div>
            );
          })}

          <input style={{ ...S.input, marginTop: 8 }} placeholder="Chercher un ingrédient…"
            value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} />
          {suggestions.length > 0 && (
            <div style={{ marginTop: 6, background: "#FAFBF8", borderRadius: 10, padding: 6 }}>
              {suggestions.map((s) => (
                <button key={s.id} onClick={() => addIngredient(s.id)}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, borderRadius: 8 }}>
                  {s.nom} <span style={{ ...S.miniMuted, fontSize: 11 }}>· {s.kcal} kcal /100g</span>
                </button>
              ))}
            </div>
          )}

          {tot && tot.grams > 0 && (
            <div style={{ ...S.miniMuted, marginTop: 12, background: C.greenPale, borderRadius: 10, padding: "10px 12px", lineHeight: 1.6 }}>
              Total : <b>{Math.round(tot.grams)} g</b> · {Math.round(tot.kcal)} kcal · P{Math.round(tot.p)} G{Math.round(tot.c)} L{Math.round(tot.f)}<br />
              Pour 100 g : <b>{Math.round(tot.kcal * 100 / tot.grams)} kcal</b> · P{(tot.p * 100 / tot.grams).toFixed(1)} G{(tot.c * 100 / tot.grams).toFixed(1)} L{(tot.f * 100 / tot.grams).toFixed(1)}
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <div style={S.miniMuted}>Portion type (g) — optionnel, pour ajouter la recette en un tap plus tard</div>
            <input type="number" value={form.portion} onChange={(e) => setForm({ ...form, portion: e.target.value })}
              style={{ ...S.input, width: 120, marginTop: 4 }} />
          </div>

          <button style={{ ...S.primaryBtn, marginTop: 12 }} onClick={save}>
            {form.editingId ? "Mettre à jour" : "Enregistrer la recette"}
          </button>
        </div>
      )}

      <div style={{ ...S.miniMuted, fontSize: 12, padding: "0 2px", lineHeight: 1.5 }}>
        Une recette est un plat que tu composes toi-même (bolognaise, poke, salade…). Elle apparaît ensuite dans tes aliments comme n'importe quel autre plat, avec ses macros calculées automatiquement.
      </div>

      {recipes.length === 0 && !form && (
        <div style={S.card}>
          <div style={{ ...S.miniMuted, fontSize: 13, lineHeight: 1.5 }}>
            Aucune recette pour l'instant. Touche « ＋ Nouvelle recette » pour en créer une.
          </div>
        </div>
      )}

      {recipes.map((rec) => (
        <div key={rec.id} style={S.card}>
          <div style={S.entryRow}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{rec.nom}</div>
              <div style={S.miniMuted}>
                {rec.kcal} kcal · P{rec.p} G{rec.c} L{rec.f} /100g · {rec.ingredients.length} ingrédients
              </div>
            </div>
            <button style={S.favBtn} onClick={() => edit(rec)}>Modifier</button>
            <button style={{ ...S.del, marginLeft: 6 }} onClick={() => suppr(rec.id)}>×</button>
          </div>
          <div style={{ ...S.miniMuted, fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            {rec.ingredients.map((it, i) => {
              const f = catalog.find((c) => c.id === it.foodId);
              return <span key={i}>{i ? " · " : ""}{f ? f.nom : "?"} {it.grams}g</span>;
            })}
          </div>
        </div>
      ))}
    </>
  );
}

/* Habitudes personnelles : combos d'aliments récurrents (ex: parmesan 30g → pâtes). */
function HabitudesView({ habitudes, setHabitudes, catalog }) {
  const [form, setForm] = useState(null); // null | { nom, items: [{label, grams}] }
  const [newItem, setNewItem] = useState({ label: "", grams: "" });
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);

  function addHabitude() {
    if (!form || !form.nom.trim()) return;
    const h = { id: "h_" + uid(), nom: form.nom.trim(), items: form.items || [] };
    setHabitudes((prev) => [...prev, h]);
    setForm(null); setNewItem({ label: "", grams: "" });
  }

  function addItem() {
    if (!newItem.label.trim()) return;
    setForm((f) => ({ ...f, items: [...(f.items || []), { label: newItem.label.trim(), grams: Number(newItem.grams) || 0 }] }));
    setNewItem({ label: "", grams: "" });
  }

  function removeItem(i) { setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) })); }

  function deleteHabitude(id) { setHabitudes((prev) => prev.filter((h) => h.id !== id)); }

  function startEdit(h) {
    setEditId(h.id);
    setForm({ nom: h.nom, items: [...h.items] });
    setNewItem({ label: "", grams: "" });
  }

  function saveEdit() {
    if (!form || !form.nom.trim()) return;
    setHabitudes((prev) => prev.map((h) => h.id === editId ? { ...h, nom: form.nom.trim(), items: form.items || [] } : h));
    setEditId(null); setForm(null); setNewItem({ label: "", grams: "" });
  }

  const isEditing = editId !== null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={S.addSmall} onClick={() => { setForm(form && !isEditing ? null : { nom: "", items: [] }); setEditId(null); setNewItem({ label: "", grams: "" }); }}>
          {form && !isEditing ? "Fermer" : "＋ Nouvelle habitude"}
        </button>
      </div>

      {(form && !isEditing) && (
        <div style={{ ...S.cardFramed, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={S.sectionLabel}>Nouvelle habitude</div>
          <input style={S.input} placeholder="Nom (ex: Pâtes au parmesan)" value={form.nom}
            onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} />
          <div style={S.sectionLabel}>Ingrédients</div>
          {(form.items || []).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.grams > 0 && <span style={{ color: C.muted }}>{item.grams} g</span>}
              <button onClick={() => removeItem(i)} style={S.del}>×</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6 }}>
            <input style={{ ...S.input, flex: 2 }} placeholder="Aliment (ex: Parmesan)" value={newItem.label}
              onChange={(e) => setNewItem((n) => ({ ...n, label: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addItem()} />
            <input style={{ ...S.input, flex: 1 }} placeholder="g" type="number" min="0" value={newItem.grams}
              onChange={(e) => setNewItem((n) => ({ ...n, grams: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addItem()} />
            <button onClick={addItem} style={{ ...S.addSmall, flexShrink: 0 }}>＋</button>
          </div>
          <button style={{ padding: "11px 0", border: "none", background: C.accent, color: "#fff", fontFamily: "'Archivo',sans-serif", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
            onClick={addHabitude}>Enregistrer</button>
        </div>
      )}

      {habitudes.length === 0 && !form && (
        <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: "40px 20px" }}>
          Aucune habitude enregistrée.<br />Crée ta première habitude — ex: « Café du matin : lait 150 ml + sucre 5 g »
        </div>
      )}

      {habitudes.map((h) => (
        <div key={h.id}>
          {editId === h.id && form ? (
            <div style={{ ...S.cardFramed, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={S.sectionLabel}>Modifier : {h.nom}</div>
              <input style={S.input} placeholder="Nom" value={form.nom}
                onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} />
              <div style={S.sectionLabel}>Ingrédients</div>
              {(form.items || []).map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.grams > 0 && <span style={{ color: C.muted }}>{item.grams} g</span>}
                  <button onClick={() => removeItem(i)} style={S.del}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6 }}>
                <input style={{ ...S.input, flex: 2 }} placeholder="Aliment" value={newItem.label}
                  onChange={(e) => setNewItem((n) => ({ ...n, label: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addItem()} />
                <input style={{ ...S.input, flex: 1 }} placeholder="g" type="number" min="0" value={newItem.grams}
                  onChange={(e) => setNewItem((n) => ({ ...n, grams: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addItem()} />
                <button onClick={addItem} style={{ ...S.addSmall, flexShrink: 0 }}>＋</button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "10px 0", border: `1px solid ${C.divider}`, background: "#fff", cursor: "pointer", fontFamily: "'Archivo',sans-serif" }}
                  onClick={() => { setEditId(null); setForm(null); }}>Annuler</button>
                <button style={{ flex: 1, padding: "10px 0", border: "none", background: C.accent, color: "#fff", fontFamily: "'Archivo',sans-serif", fontWeight: 700, cursor: "pointer" }}
                  onClick={saveEdit}>Sauvegarder</button>
              </div>
            </div>
          ) : (
            <div style={{ ...S.cardFramed, cursor: "pointer" }} onClick={() => setOpenId(openId === h.id ? null : h.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{h.nom}</div>
                  {h.items.length > 0 && <div style={{ ...S.miniMuted, marginTop: 2 }}>{h.items.length} ingrédient{h.items.length > 1 ? "s" : ""}</div>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={(e) => { e.stopPropagation(); startEdit(h); }}
                    style={{ background: "none", border: `1px solid ${C.divider}`, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'Archivo',sans-serif", color: C.accent }}>
                    Modifier
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteHabitude(h.id); }}
                    style={S.del}>×</button>
                  <span style={{ color: C.muted, fontSize: 18 }}>{openId === h.id ? "▲" : "▼"}</span>
                </div>
              </div>
              {openId === h.id && h.items.length > 0 && (
                <div style={{ marginTop: 12, borderTop: `1px solid ${C.divider}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {h.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span>{item.label}</span>
                      {item.grams > 0 && <span style={{ color: C.muted, fontWeight: 600 }}>{item.grams} g</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* Feed communautaire des repas partagés (photo + fiche technique). */
function MealsFeed({ catalog, customFoods, setCustomFoods }) {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(null); // { nom, description, photo, items:[{foodId,grams}], portion, q }
  const [detail, setDetail] = useState(null);
  const api = (typeof window !== "undefined") ? window.NUTRI_SHARED_MEALS : null;

  useEffect(() => {
    if (!api) { setErr("Connecte-toi pour voir les repas partagés."); setItems([]); return; }
    (async () => {
      setBusy(true);
      const arr = await api.list(60);
      setItems(arr);
      setBusy(false);
    })();
  }, []);

  async function refresh() {
    if (!api) return;
    setBusy(true);
    const arr = await api.list(60);
    setItems(arr);
    setBusy(false);
  }

  function startPost() {
    setForm({ nom: "", description: "", photo: null, items: [], portion: 300, q: "" });
  }
  function addIngredient(food) {
    setForm((f) => ({ ...f, items: [...f.items, { foodId: food.id, nom: food.nom, grams: 100 }], q: "" }));
  }
  function updateGrams(idx, g) {
    setForm((f) => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, grams: Number(g) || 0 } : it) }));
  }
  function removeIngredient(idx) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }
  function onPhoto(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 720, scale = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = img.width * scale; cv.height = img.height * scale;
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        setForm((f) => ({ ...f, photo: cv.toDataURL("image/jpeg", 0.72) }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
  function totalsFor(items) {
    return items.reduce((acc, it) => {
      const food = catalog.find((c) => c.id === it.foodId);
      if (!food) return acc;
      const g = Number(it.grams) || 0;
      const factor = g / 100;
      acc.grams += g;
      acc.kcal += (food.kcal || 0) * factor;
      acc.p += (food.p || 0) * factor;
      acc.c += (food.c || 0) * factor;
      acc.f += (food.f || 0) * factor;
      acc.fib += (food.fib || 0) * factor;
      acc.suc += (food.suc || 0) * factor;
      return acc;
    }, { grams: 0, kcal: 0, p: 0, c: 0, f: 0, fib: 0, suc: 0 });
  }

  async function post() {
    if (!form.nom.trim()) { window.alert("Donne un nom à ton plat."); return; }
    if (!form.items.length) { window.alert("Ajoute au moins un ingrédient."); return; }
    const tot = totalsFor(form.items);
    if (tot.grams <= 0) { window.alert("Poids total nul."); return; }
    setBusy(true); setErr("");
    const per100 = (v) => +(v * 100 / tot.grams).toFixed(1);
    const portion = Number(form.portion) || Math.round(tot.grams);
    const factor = portion / 100;
    try {
      const saved = await api.submit({
        nom: form.nom.trim(),
        description: form.description.trim(),
        photo: form.photo,
        ingredients: form.items.map((i) => ({ nom: i.nom, grams: Number(i.grams) || 0 })),
        // On stocke les macros POUR 100g pour permettre le repartage à d'autres portions
        kcal: per100(tot.kcal), p: per100(tot.p), c: per100(tot.c), f: per100(tot.f),
        fib: per100(tot.fib), suc: per100(tot.suc),
        portion,
      });
      if (!saved) throw new Error("save failed");
      setForm(null);
      await refresh();
    } catch (e) {
      setErr("Impossible de publier (connexion ou permissions Firestore).");
    }
    setBusy(false);
  }

  async function like(id) {
    if (!api) return;
    setItems((arr) => arr.map((x) => x.id === id ? { ...x, likes: (x.likes || 0) + 1, _liked: true } : x));
    await api.like(id);
  }

  async function del(id) {
    if (!api) return;
    if (!window.confirm("Supprimer ton post ? Action irréversible.")) return;
    await api.remove(id);
    await refresh();
  }

  function importToCatalog(m) {
    // Ajoute le plat comme aliment personnel (macros pour 100 g).
    const food = {
      id: "u_" + uid(),
      nom: `${m.nom} (partagé par ${m.authorName})`,
      grp: m.grp || "plat",
      kcal: Number(m.kcal) || 0, p: Number(m.p) || 0, c: Number(m.c) || 0, f: Number(m.f) || 0,
      fib: Number(m.fib) || 0, suc: Number(m.suc) || 0,
      portion: Number(m.portion) || 200,
    };
    setCustomFoods((cf) => [...cf, food]);
    window.alert(`« ${m.nom} » ajouté à ta liste perso — tu peux le retrouver dans Aliments.`);
  }

  const suggestions = form && form.q
    ? catalog.filter((f) => norm(f.nom).includes(norm(form.q))).slice(0, 6)
    : [];
  const tot = form ? totalsFor(form.items) : null;

  return (
    <>
      {/* Bandeau accent : contexte communautaire */}
      <div style={{ background: C.accentTint, border: `2px solid ${C.accent}`, padding: "14px 16px" }}>
        <div style={{ ...S.kicker, color: C.accent, marginBottom: 6 }}>REPAS PARTAGÉS PAR LA COMMUNAUTÉ</div>
        <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>
          Photos de plats + fiches techniques (ingrédients, macros, portion) postés par d'autres utilisateurs. <b>Inspire-toi, likes, et importe dans ta liste perso en un tap.</b> Chacun peut poster ses propres plats pour aider la communauté.
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 4px" }}>
        <button style={S.addSmall} onClick={() => form ? setForm(null) : startPost()}>
          {form ? "Fermer" : "＋ Partager mon plat"}
        </button>
      </div>

      {form && (
        <div style={S.card}>
          <div style={S.sectionLabel}>Partager un plat</div>

          {/* Photo */}
          <div style={{ marginBottom: 12 }}>
            {form.photo ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={form.photo} alt="" style={{ maxWidth: "100%", maxHeight: 240, objectFit: "cover", display: "block", border: `1px solid ${C.divider}` }} />
                <button onClick={() => setForm({ ...form, photo: null })}
                  style={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, border: "none", background: "rgba(0,0,0,.65)", color: "#fff", cursor: "pointer" }}>×</button>
              </div>
            ) : (
              <label style={{ ...S.photoBtn, display: "block", padding: "18px 0", textAlign: "center", cursor: "pointer" }}>
                📷 Ajouter une photo du plat
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={onPhoto} />
              </label>
            )}
          </div>

          <input style={{ ...S.input, marginBottom: 8 }} placeholder="Nom du plat (ex : Poke bowl saumon-avocat)"
            value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          <textarea style={{ ...S.input, marginBottom: 8, minHeight: 60, resize: "vertical", fontFamily: "'Archivo', sans-serif" }}
            placeholder="Description (optionnel) — technique, astuce, contexte…"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div style={{ ...S.miniMuted, marginTop: 8, marginBottom: 6 }}>Ingrédients</div>
          {form.items.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <div style={{ flex: 1, fontSize: 14 }}>{it.nom}</div>
              <input type="number" value={it.grams} onChange={(e) => updateGrams(i, e.target.value)}
                style={{ ...S.input, width: 80, padding: "8px 10px", margin: 0 }} />
              <span style={{ ...S.miniMuted, fontSize: 12 }}>g</span>
              <button style={S.del} onClick={() => removeIngredient(i)}>×</button>
            </div>
          ))}
          <input style={{ ...S.input, marginTop: 8 }} placeholder="Chercher un ingrédient…"
            value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} />
          {suggestions.length > 0 && (
            <div style={{ marginTop: 6, background: "#FAFBF8", padding: 6 }}>
              {suggestions.map((s) => (
                <button key={s.id} onClick={() => addIngredient(s)}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14 }}>
                  {s.nom} <span style={{ ...S.miniMuted, fontSize: 11 }}>· {s.kcal} kcal /100g</span>
                </button>
              ))}
            </div>
          )}

          {tot && tot.grams > 0 && (
            <div style={{ ...S.miniMuted, marginTop: 12, background: C.accentTint, padding: "10px 12px", lineHeight: 1.6, color: C.accent }}>
              Total plat : <b>{Math.round(tot.grams)} g</b> · {Math.round(tot.kcal)} kcal · P{Math.round(tot.p)} G{Math.round(tot.c)} L{Math.round(tot.f)}<br />
              Pour 100 g : <b>{Math.round(tot.kcal * 100 / tot.grams)} kcal</b>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <div style={S.miniMuted}>Portion type (g) — celle qui sera affichée aux autres</div>
            <input type="number" value={form.portion} onChange={(e) => setForm({ ...form, portion: e.target.value })}
              style={{ ...S.input, width: 120, marginTop: 4 }} />
          </div>

          <button style={{ ...S.primaryBtn, marginTop: 12, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={post}>
            {busy ? "Publication…" : "Publier"}
          </button>
        </div>
      )}

      {busy && items === null && <div style={{ ...S.miniMuted, textAlign: "center", padding: 20 }}>Chargement des repas partagés…</div>}
      {err && <div style={{ ...S.miniMuted, fontSize: 12, color: C.negative, padding: "0 4px" }}>{err}</div>}

      {items && items.length === 0 && !form && (
        <div style={S.card}>
          <div style={{ ...S.miniMuted, fontSize: 13, lineHeight: 1.5 }}>
            Personne n'a encore posté de repas. <b>Sois le premier !</b> Touche « ＋ Partager mon plat » pour ajouter une photo + les ingrédients — ton post sera visible par tous.
          </div>
        </div>
      )}

      {items && items.map((m) => (
        <div key={m.id} style={S.cardFramed}>
          {m.photo && (
            <img src={m.photo} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block", marginBottom: 12, cursor: "pointer" }}
              onClick={() => setDetail(m)} />
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}>{m.nom}</div>
              <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                PAR {m.authorName || "?"} · {new Date(m.createdAt).toLocaleDateString("fr-BE", { day: "2-digit", month: "short" })}
              </div>
              {m.description && (
                <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>{m.description}</div>
              )}
              <div style={{ marginTop: 10, display: "flex", gap: 18, flexWrap: "wrap" }}>
                <div>
                  <div style={{ ...S.sectionLabel, marginBottom: 2, fontSize: 10 }}>PORTION</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{m.portion} g</div>
                </div>
                <div>
                  <div style={{ ...S.sectionLabel, marginBottom: 2, fontSize: 10 }}>KCAL / PORTION</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{Math.round((m.kcal || 0) * m.portion / 100)}</div>
                </div>
                <div>
                  <div style={{ ...S.sectionLabel, marginBottom: 2, fontSize: 10 }}>P·G·L / 100 G</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{Math.round(m.p)}·{Math.round(m.c)}·{Math.round(m.f)}</div>
                </div>
              </div>
            </div>
          </div>

          {m.ingredients && m.ingredients.length > 0 && (
            <div style={{ ...S.miniMuted, fontSize: 12, marginTop: 12, lineHeight: 1.5, borderTop: `1px solid ${C.divider}`, paddingTop: 10 }}>
              <b>Ingrédients :</b> {m.ingredients.map((i, k) => `${i.nom} ${i.grams}g`).join(" · ")}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button style={{ ...S.addSmall }} onClick={() => importToCatalog(m)}>＋ Ajouter à ma liste</button>
            <button onClick={() => like(m.id)}
              style={{ padding: "8px 14px", border: `1px solid ${C.divider}`, background: m._liked ? C.accentTint : "#fff", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>
              ♥ {m.likes || 0}
            </button>
            {api && m.authorUid === api.currentUid && (
              <button onClick={() => del(m.id)}
                style={{ padding: "8px 14px", border: `1px solid ${C.divider}`, background: "#fff", color: C.negative, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>
                Supprimer mon post
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

function FavorisView({ favMeals, onDelete, onRename, onUpdate, catalog }) {
  const [editing, setEditing] = useState(null); // { id, items, q }

  function recalcItem(it, newGrams) {
    const g = Number(newGrams) || 0;
    const food = catalog.find((f) => f.id === it.foodId);
    if (food) {
      return { ...it, grams: g, kcal: food.kcal * g / 100, p: food.p * g / 100, c: food.c * g / 100, f: food.f * g / 100, fib: (food.fib || 0) * g / 100, suc: (food.suc || 0) * g / 100 };
    }
    const factor = g / (it.grams || 1);
    return { ...it, grams: g, kcal: (it.kcal || 0) * factor, p: (it.p || 0) * factor, c: (it.c || 0) * factor, f: (it.f || 0) * factor, fib: (it.fib || 0) * factor, suc: (it.suc || 0) * factor };
  }
  function addItem(food) {
    const g = 100;
    setEditing((e) => ({ ...e, items: [...e.items, { foodId: food.id, nom: food.nom, grams: g, kcal: food.kcal, p: food.p, c: food.c, f: food.f, fib: food.fib || 0, suc: food.suc || 0 }], q: "" }));
  }
  function save() {
    onUpdate(editing.id, editing.items);
    setEditing(null);
  }

  const suggestions = editing && editing.q
    ? catalog.filter((f) => norm(f.nom).includes(norm(editing.q))).slice(0, 6)
    : [];

  if (!favMeals.length && !editing) {
    return (
      <div style={S.card}>
        <div style={S.sectionLabel}>Repas favoris</div>
        <div style={{ ...S.miniMuted, fontSize: 13, lineHeight: 1.5 }}>
          Aucun repas enregistré pour l'instant. Dans l'agenda, remplis un repas puis touche « ★ Enregistrer » pour le retrouver ici et l'ajouter en un seul tap.
        </div>
      </div>
    );
  }
  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Repas favoris ({favMeals.length})</div>
      {favMeals.map((fav) => (
        <div key={fav.id}>
          <div style={S.entryRow}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.green }}>★ {fav.nom}</div>
              <div style={S.miniMuted}>{fav.items.length} aliments · {Math.round(fav.items.reduce((a, i) => a + (i.kcal || 0), 0))} kcal</div>
            </div>
            <button style={S.favBtn} onClick={() => setEditing({ id: fav.id, items: fav.items.map((i) => ({ ...i })), q: "" })}>Modifier</button>
            <button style={S.favBtn} onClick={() => { const n = (window.prompt("Renommer le repas :", fav.nom) || "").trim(); if (n) onRename(fav.id, n); }}>Renommer</button>
            <button style={{ ...S.del, marginLeft: 6 }} onClick={() => onDelete(fav.id)}>×</button>
          </div>

          {editing && editing.id === fav.id && (
            <div style={{ background: "#FAFBF8", borderRadius: 12, padding: 12, margin: "6px 0 12px" }}>
              <div style={{ ...S.miniMuted, marginBottom: 6 }}>Ajuste les grammages, remplace ou supprime</div>
              {editing.items.map((it, idx) => (
                <div key={idx} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.nom}</div>
                  <input type="number" value={it.grams}
                    onChange={(e) => setEditing((ed) => ({ ...ed, items: ed.items.map((x, i) => i === idx ? recalcItem(x, e.target.value) : x) }))}
                    style={{ ...S.input, width: 70, padding: "6px 8px", margin: 0, textAlign: "right" }} />
                  <span style={{ ...S.miniMuted, fontSize: 12 }}>g</span>
                  <button style={S.del} onClick={() => setEditing((ed) => ({ ...ed, items: ed.items.filter((_, i) => i !== idx) }))}>×</button>
                </div>
              ))}

              <input style={{ ...S.input, marginTop: 8 }} placeholder="Ajouter un aliment…"
                value={editing.q} onChange={(e) => setEditing((ed) => ({ ...ed, q: e.target.value }))} />
              {suggestions.length > 0 && (
                <div style={{ marginTop: 6, background: "#fff", borderRadius: 10, padding: 4 }}>
                  {suggestions.map((s) => (
                    <button key={s.id} onClick={() => addItem(s)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, borderRadius: 8 }}>
                      {s.nom} <span style={{ ...S.miniMuted, fontSize: 11 }}>· {s.kcal} kcal /100g</span>
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={{ ...S.primaryBtn, marginTop: 0, flex: 1 }} onClick={save}>Enregistrer</button>
                <button onClick={() => setEditing(null)}
                  style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", color: C.ink, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
        Pour ajouter un favori : dans l'agenda, touche « + » sur le repas voulu — tes favoris apparaissent en haut de la fenêtre.
      </div>
    </div>
  );
}
function NumIn({ label, v, on }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...S.miniMuted, marginBottom: 3, fontSize: 11 }}>{label}</div>
      <input type="number" value={v || ""} onChange={(e) => on(e.target.value)}
        style={{ ...S.input, padding: "9px 8px", fontSize: 14 }} />
    </div>
  );
}

/* =========================== GRAPHIQUE ========================== */
function Graphique({ diary, cible, poidsLog, objectif, sport, maintenance, crediterSport, partSport, sportMode, sportSpreadDays }) {
  const [metric, setMetric] = useState("calories"); // calories | net | poids
  const [gran, setGran] = useState("semaine");       // semaine | mois
  const [zoom, setZoom] = useState(0);               // index dans les fenêtres

  const FEN = metric === "sport"
    ? (gran === "semaine" ? [4, 8, 12] : [3, 6, 12])
    : (gran === "semaine" ? [1, 2, 4] : [3, 6, 12]);
  const span = FEN[Math.min(zoom, FEN.length - 1)];

  const data = useMemo(() => {
    if (metric === "poids") return poidsDataFn(poidsLog, gran, span);
    if (metric === "sport") return gran === "semaine" ? sportByWeek(sport, span) : sportByMonth(sport, span);
    if (metric === "net") return gran === "semaine"
      ? netWeekly(diary, sport, span, partSport, sportMode, sportSpreadDays, crediterSport)
      : netMonthly(diary, sport, span, partSport, sportMode, sportSpreadDays, crediterSport);
    return gran === "semaine" ? kcalWeekly(diary, span) : kcalMonthly(diary, span);
  }, [metric, gran, span, diary, sport, poidsLog, partSport, sportMode, sportSpreadDays, crediterSport]);

  const bilan = useMemo(() => {
    let intake = 0, sportK = 0, days = 0;
    for (let i = 0; i < 7; i++) {
      const d = shiftDate(todayISO(), -i);
      const cons = sommeMacros(diary[d]).kcal;
      if (cons > 0) { intake += cons; days += 1; }
      sportK += sommeSport(sport[d]);
    }
    const avgIntake = days ? Math.round(intake / days) : 0;
    const avgSport = Math.round(sportK / 7);
    const frac = (partSport ?? 60) / 100;
    const depense = maintenance + (crediterSport ? avgSport * frac : 0);
    const deficit = avgIntake ? Math.round(depense - avgIntake) : 0;
    const kgWeek = -(deficit * 7 / 7700);
    return { avgIntake, avgSport, deficit, kgWeek, days };
  }, [diary, sport, maintenance, crediterSport, partSport]);

  const poidsTrend = useMemo(() => {
    if (poidsLog.length < 2) return null;
    const recent = poidsLog.slice(-8);
    const first = recent[0], last = recent[recent.length - 1];
    const dd = Math.max(1, (new Date(last.date) - new Date(first.date)) / 86400000);
    return { perWeek: (last.poids - first.poids) / dd * 7, span: Math.round(dd) };
  }, [poidsLog]);

  const nBars = data.length;
  const xAngle = nBars > 7 ? -45 : 0;
  const xInterval = nBars <= 14 ? 0 : 2;
  const xHeight = nBars > 7 ? 40 : (metric === "poids" || gran === "mois" ? 18 : 22);

  const refLine = metric === "poids" ? objectif : cible;
  const moy = data.length ? Math.round(data.filter((d) => d.v > 0).reduce((a, d) => a + d.v, 0) / Math.max(1, data.filter((d) => d.v > 0).length)) : 0;
  const sportTotal = metric === "sport" ? data.reduce((a, d) => a + d.v, 0) : 0;

  /* Bandeau chiffre-clé + stats secondaires selon la métrique */
  const stats = (() => {
    if (metric === "poids") {
      const dernier = poidsLog[poidsLog.length - 1];
      const depart = poidsLog[0];
      const delta = depart && dernier ? +(dernier.poids - depart.poids).toFixed(1) : null;
      const perDay = poidsTrend ? +(poidsTrend.perWeek / 7).toFixed(2) : null;
      return {
        kickerBig: "POIDS ACTUEL",
        big: dernier ? dernier.poids : "—",
        bigUnit: "kg",
        bigColor: C.accent,
        secondaires: [
          delta !== null && { label: "DEPUIS LE DÉBUT", val: `${delta > 0 ? "+" : ""}${delta} kg`, color: delta <= 0 ? C.positive : C.negative },
          perDay !== null && { label: "PAR JOUR", val: `${perDay > 0 ? "+" : ""}${perDay} kg`, color: C.ink },
        ].filter(Boolean),
      };
    }
    if (metric === "sport") {
      return {
        kickerBig: "SPORT TOTAL",
        big: sportTotal,
        bigUnit: "kcal",
        bigColor: C.accent,
        secondaires: [
          { label: "≈ GRAS BRÛLÉ", val: `${Math.round(sportTotal / 7.7)} g`, color: C.ink },
          { label: gran === "semaine" ? "MOY. / SEMAINE" : "MOY. / MOIS", val: `${data.length ? Math.round(sportTotal / data.length) : 0} kcal`, color: C.ink },
        ],
      };
    }
    const enTarget = data.filter((d) => d.v > 0 && d.v <= cible).length;
    const withData = data.filter((d) => d.v > 0).length;
    return {
      kickerBig: metric === "net" ? "MOYENNE NETTE" : "MOYENNE MANGÉE",
      big: moy || 0,
      bigUnit: "kcal / j",
      bigColor: C.accent,
      secondaires: [
        { label: "CIBLE", val: `${cible}`, color: C.ink },
        withData > 0 && { label: gran === "semaine" ? "JOURS SOUS CIBLE" : "PÉRIODES SOUS CIBLE", val: `${enTarget}/${withData}`, color: C.accent },
      ].filter(Boolean),
    };
  })();

  const bilanRows = bilan.days > 0 ? [
    { l: "Moyenne mangée / jour", r: `${bilan.avgIntake} kcal` },
    { l: "Sport / jour (moy.)", r: `${bilan.avgSport} kcal` },
    { l: "Déficit estimé / jour", r: `${bilan.deficit >= 0 ? "−" : "+"}${Math.abs(bilan.deficit)} kcal`, strong: true, color: bilan.deficit >= 0 ? C.positive : C.negative },
    { l: "Projection", r: `${bilan.kgWeek > 0 ? "+" : ""}${bilan.kgWeek.toFixed(2)} kg/sem`, strong: true, color: bilan.kgWeek <= 0 ? C.positive : C.negative },
    poidsTrend && { l: `Réel — balance (${poidsTrend.span} j)`, r: `${poidsTrend.perWeek > 0 ? "+" : ""}${poidsTrend.perWeek.toFixed(2)} kg/sem`, color: poidsTrend.perWeek <= 0 ? C.positive : C.negative },
  ].filter(Boolean) : [];

  return (
    <div style={{ padding: "40px 44px 60px", background: C.bg }}>
      {/* Kicker STATISTIQUES */}
      <div style={S.kicker}>STATISTIQUES</div>
      <div style={S.kickerTrait} />

      {/* Contrôles segmentés Mesure + Période */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
        <div>
          <div style={{ ...S.sectionLabel, marginBottom: 8 }}>MESURE</div>
          <div style={{ display: "inline-flex", border: `1px solid ${C.divider}` }}>
            {[["calories", "Calories"], ["net", "Net"], ["poids", "Poids"], ["sport", "Sport"]].map(([k, l], i) => (
              <button key={k} onClick={() => { setMetric(k); setZoom(0); }}
                style={{ padding: "9px 20px", border: "none", borderLeft: i === 0 ? "none" : `1px solid ${C.divider}`, background: metric === k ? C.accent : "#fff", color: metric === k ? "#fff" : C.ink, fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...S.sectionLabel, marginBottom: 8 }}>PÉRIODE</div>
          <div style={{ display: "inline-flex", border: `1px solid ${C.divider}` }}>
            {[["semaine", "Semaine"], ["mois", "Mois"]].map(([k, l], i) => (
              <button key={k} onClick={() => { setGran(k); setZoom(0); }}
                style={{ padding: "9px 20px", border: "none", borderLeft: i === 0 ? "none" : `1px solid ${C.divider}`, background: gran === k ? C.accent : "#fff", color: gran === k ? "#fff" : C.ink, fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Divider 2px */}
      <div style={{ borderTop: `2px solid ${C.divider}`, marginBottom: 32 }} />

      {/* Bandeau chiffre-clé */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 56, flexWrap: "wrap", marginBottom: 32 }}>
        <div>
          <div style={{ ...S.sectionLabel, marginBottom: 12 }}>{stats.kickerBig}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.03em", color: stats.bigColor, lineHeight: 0.85, fontFamily: "'Archivo', sans-serif" }}>
              {stats.big}
            </div>
            <div style={{ fontSize: 15, color: C.muted, fontWeight: 500 }}>{stats.bigUnit}</div>
          </div>
        </div>
        {stats.secondaires.map((s, i) => (
          <div key={i}>
            <div style={{ ...S.sectionLabel, marginBottom: 12 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: s.color, lineHeight: 1, fontFamily: "'Archivo', sans-serif" }}>{s.val}</div>
          </div>
        ))}
        {/* Zoom compact */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button style={S.zoomBtn} onClick={() => setZoom((z) => Math.min(FEN.length - 1, z + 1))}>−</button>
          <span style={{ fontSize: 12, color: C.muted, minWidth: 60, textAlign: "center", fontWeight: 600 }}>
            {gran === "semaine" ? `${span} sem` : `${span} mois`}
          </span>
          <button style={S.zoomBtn} onClick={() => setZoom((z) => Math.max(0, z - 1))}>+</button>
        </div>
      </div>

      {metric === "net" && (
        <div style={{ fontSize: 12, color: C.accent, background: C.accentTint, padding: "10px 14px", marginBottom: 18, lineHeight: 1.55 }}>
          <b>Net = ce que tu as réellement absorbé.</b> Si tu manges 2 200 kcal mais dépenses 400 kcal en sport, ton net est 1 800. C'est ce chiffre qui compte face à ta cible quand tu logges tes séances.
        </div>
      )}

      {/* Graphique — restylé Modernist */}
      <div style={{ height: 320, marginBottom: 22 }}>
        <ResponsiveContainer width="100%" height="100%">
          {metric === "poids" ? (
            <LineChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={C.divider} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: C.muted, fontFamily: "Archivo" }} axisLine={{ stroke: C.divider }} tickLine={false} interval={xInterval} angle={xAngle} textAnchor={xAngle ? "end" : "middle"} height={xHeight} />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10, fill: C.muted, fontFamily: "Archivo" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip formatter={(v) => [`${v} kg`, ""]} contentStyle={S.tooltip} labelStyle={{ color: C.muted }} />
              <ReferenceLine y={refLine} stroke={C.accent} strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: `Objectif ${refLine}`, position: "right", fill: C.accent, fontSize: 11, fontFamily: "Archivo", fontWeight: 700 }} />
              <Line type="monotone" dataKey="v" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent, strokeWidth: 0 }} activeDot={{ r: 6, fill: C.accent }} />
              {gran === "semaine" && <Line type="monotone" dataKey="ma" stroke={C.accentDark} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />}
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 24, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={C.divider} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: C.muted, fontFamily: "Archivo" }} axisLine={{ stroke: C.divider }} tickLine={false} interval={xInterval} angle={xAngle} textAnchor={xAngle ? "end" : "middle"} height={xHeight} />
              <YAxis tick={{ fontSize: 10, fill: C.muted, fontFamily: "Archivo" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip formatter={(v) => [`${v} kcal`, ""]} contentStyle={S.tooltip} labelStyle={{ color: C.muted }} cursor={{ fill: C.accentTint }} />
              {metric !== "sport" && (
                <ReferenceLine y={refLine} stroke={C.accent} strokeDasharray="4 4" strokeWidth={1.5}
                  label={{ value: `Cible ${refLine}`, position: "right", fill: C.accent, fontSize: 11, fontFamily: "Archivo", fontWeight: 700 }} />
              )}
              <Bar dataKey="v" radius={0} fill={metric === "net" ? C.accentDark : C.accent}>
                {data.map((d, i) => (
                  <Cell key={i}
                    fill={d.v === 0 ? C.divider
                      : metric === "sport" ? C.accent
                      : (d.v <= cible ? C.accent : C.negative)} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div style={{ fontSize: 12, color: C.muted, marginBottom: 32, lineHeight: 1.55 }}>
        {metric === "sport"
          ? (gran === "semaine" ? "Chaque barre = calories brûlées en sport dans la semaine." : "Chaque barre = calories brûlées en sport dans le mois.")
          : metric === "poids"
          ? "Courbe = poids enregistré. Ligne pointillée = ton objectif."
          : (gran === "mois" ? "Chaque barre = moyenne des kcal/jour du mois. Ligne pointillée = cible." : "Chaque barre = total du jour. Ligne pointillée = cible.")}
        {" "}Utilise − / + pour zoomer.
      </div>

      {/* Bilan 7 jours */}
      {bilanRows.length > 0 && (
        <div style={{ borderTop: `2px solid ${C.divider}`, paddingTop: 24 }}>
          <div style={{ ...S.sectionLabel, marginBottom: 14 }}>BILAN — 7 DERNIERS JOURS</div>
          <div>
            {bilanRows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i === bilanRows.length - 1 ? "none" : `1px solid ${C.divider}`, fontSize: 14 }}>
                <span style={{ color: C.muted }}>{r.l}</span>
                <span style={{ fontWeight: r.strong ? 800 : 600, color: r.color || C.ink, fontFamily: "'Archivo', sans-serif" }}>{r.r}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 12, lineHeight: 1.55 }}>
            La projection est une estimation. Si elle s'écarte du réel de la balance sur 2-3 semaines, ajuste de 100-200 kcal.
          </div>
        </div>
      )}
    </div>
  );
}

/* Nb de jours consécutifs (en remontant) où kcal du jour <= cible*tol et >0 */
function streakUnderTarget(diary, cible, tol = 1.05) {
  let n = 0;
  const start = shiftDate(todayISO(), -1); // hors aujourd'hui (souvent incomplet)
  for (let i = 0; i < 365; i++) {
    const d = shiftDate(start, -i);
    const k = sommeMacros(diary[d]).kcal;
    if (k > 0 && k <= cible * tol) n++;
    else break;
  }
  return n;
}

/* Aliments les plus récents utilisés (uniques, du plus récent au plus ancien) */
function recentUniqueFoods(diary, catalog, limit = 4) {
  const seen = [];
  const dates = Object.keys(diary || {}).sort().reverse();
  for (const d of dates) {
    for (const e of (diary[d] || [])) {
      if (!seen.includes(e.foodId) && catalog.find((f) => f.id === e.foodId)) seen.push(e.foodId);
      if (seen.length >= limit * 2) break;
    }
    if (seen.length >= limit * 2) break;
  }
  return seen.slice(0, limit).map((id) => catalog.find((f) => f.id === id)).filter(Boolean);
}

/* Récap du mois donné (YYYY, MM 0-indexé) */
function monthlyReview(diary, sport, poidsLog, year, month) {
  const first = new Date(year, month, 1);
  const nbDays = new Date(year, month + 1, 0).getDate();
  const iso = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  let totalKcal = 0, daysLogged = 0, totalSport = 0, sessions = 0;
  for (let d = 1; d <= nbDays; d++) {
    const k = sommeMacros(diary[iso(d)]).kcal;
    if (k > 0) { totalKcal += k; daysLogged++; }
    const ss = (sport[iso(d)] || []);
    sessions += ss.length;
    totalSport += sommeSport(ss);
  }
  const avgKcal = daysLogged ? Math.round(totalKcal / daysLogged) : 0;
  const sorted = [...(poidsLog || [])].sort((a, b) => a.date.localeCompare(b.date));
  const start = sorted.find((x) => x.date >= iso(1));
  const end = [...sorted].reverse().find((x) => x.date <= iso(nbDays));
  const kgDelta = start && end ? +(end.poids - start.poids).toFixed(1) : null;
  return { avgKcal, daysLogged, totalSport: Math.round(totalSport), sessions, kgDelta, monthName: moisNom[month], year, nbDays };
}

/* Badges : évaluation client-only à partir de l'état de l'app. */
const BADGES = [
  { id: "streak7",     t: "Une semaine sans faille",     d: "7 jours consécutifs sous la cible.",           test: (s) => s.streak >= 7 },
  { id: "streak30",    t: "30 jours d'affilée",          d: "30 jours consécutifs sous la cible.",          test: (s) => s.streak >= 30 },
  { id: "logged7",     t: "Une semaine complète loggée", d: "Tu as loggé au moins un repas 7 jours d'affilée.", test: (s) => s.loggedDays >= 7 },
  { id: "logged30",    t: "Un mois de suivi",            d: "30 jours différents avec au moins un repas loggé.", test: (s) => s.loggedDays >= 30 },
  { id: "kg1lost",     t: "Premier kilo",                d: "Ton poids actuel est 1 kg sous ton départ.",   test: (s) => s.kgLost >= 1 },
  { id: "kg5lost",     t: "5 kilos allégé",              d: "Ton poids actuel est 5 kg sous ton départ.",   test: (s) => s.kgLost >= 5 },
  { id: "objectif",    t: "Objectif atteint",            d: "Tu es à ton poids objectif — ou en dessous.",  test: (s) => s.reachedGoal },
  { id: "list100",     t: "Catalogue riche",             d: "100 aliments persos dans ta liste.",           test: (s) => s.customFoodsCount >= 100 },
  { id: "recipe1",     t: "Chef à la maison",            d: "Ta première recette maison enregistrée.",      test: (s) => s.recipesCount >= 1 },
  { id: "recipe10",    t: "Livre de cuisine",            d: "10 recettes maison créées.",                   test: (s) => s.recipesCount >= 10 },
  { id: "fav5",        t: "Habitudes bien huilées",      d: "5 repas favoris enregistrés.",                 test: (s) => s.favMealsCount >= 5 },
  { id: "sport10",     t: "Sportif régulier",            d: "10 séances de sport loggées.",                 test: (s) => s.sportSessions >= 10 },
  { id: "shared50",    t: "Contributeur communauté",     d: "50 codes-barres scannés ou aliments ajoutés à la base commune.", test: (s) => s.sharedContribs >= 50 },
  { id: "shared200",   t: "Pilier de la base commune",   d: "200 contributions à la base partagée.",        test: (s) => s.sharedContribs >= 200 },
];

function computeBadgeStats({ diary, profil, poidsLog, customFoods, favMeals, sport }) {
  const cible = Math.max(1400, (profil.deficit ? (Math.round(mifflin(profil) * (neatF(profil) + sportB(profil))) - profil.deficit) : 0));
  const streak = streakUnderTarget(diary, cible);
  const loggedDays = Object.keys(diary || {}).filter((d) => (diary[d] || []).length > 0).length;
  const sortedLog = [...(poidsLog || [])].sort((a, b) => a.date.localeCompare(b.date));
  const depart = sortedLog[0]?.poids || 0;
  const dernier = sortedLog[sortedLog.length - 1]?.poids || 0;
  const kgLost = depart && dernier ? +(depart - dernier).toFixed(1) : 0;
  const reachedGoal = dernier && profil.objectif && dernier <= profil.objectif;
  const customFoodsCount = (customFoods || []).filter((f) => !Array.isArray(f.ingredients)).length;
  const recipesCount = (customFoods || []).filter((f) => Array.isArray(f.ingredients) && f.ingredients.length).length;
  const favMealsCount = (favMeals || []).length;
  const sportSessions = Object.values(sport || {}).reduce((a, arr) => a + (arr || []).length, 0);
  // Approx : chaque aliment personnalisé compte comme une contribution ; extension : lire un compteur Firestore plus tard.
  const sharedContribs = customFoodsCount + recipesCount;
  return { streak, loggedDays, kgLost, reachedGoal, customFoodsCount, recipesCount, favMealsCount, sportSessions, sharedContribs };
}

function kcalWeekly(diary, weeks) {
  const dow = (new Date(todayISO()).getDay() + 6) % 7;          // 0 = lundi
  const startMonday = shiftDate(todayISO(), -dow - (weeks - 1) * 7);
  const arr = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = shiftDate(startMonday, i);
    const dt = new Date(d);
    const wd = joursCourt[dt.getDay()];
    arr.push({
      label: i === 0 ? `${wd} ${dt.getDate()}/${dt.getMonth() + 1}` : wd,
      v: Math.round(sommeMacros(diary[d]).kcal), date: d,
    });
  }
  return arr;
}
function kcalMonthly(diary, spanMonths) {
  const now = new Date();
  const buckets = [];
  for (let i = spanMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ y: d.getFullYear(), m: d.getMonth(), total: 0, days: 0 });
  }
  Object.entries(diary).forEach(([date, entries]) => {
    const dt = new Date(date);
    const b = buckets.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth());
    if (b) { b.total += sommeMacros(entries).kcal; b.days += 1; }
  });
  return buckets.map((b) => ({ label: moisNom[b.m], v: b.days ? Math.round(b.total / b.days) : 0 }));
}
function netWeekly(diary, sport, weeks, partSport = 70, sportMode = "jour", spreadDays = 7, crediterSport = false) {
  const dow = (new Date(todayISO()).getDay() + 6) % 7;
  const startMonday = shiftDate(todayISO(), -dow - (weeks - 1) * 7);
  const arr = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = shiftDate(startMonday, i);
    const dt = new Date(d);
    const wd = joursCourt[dt.getDay()];
    const cons = Math.round(sommeMacros(diary[d]).kcal);
    const burn = crediterSport ? creditedKcal(d, sport, partSport, sportMode, spreadDays) : Math.round(sommeSport(sport[d]) * (partSport / 100));
    arr.push({
      label: i === 0 ? `${wd} ${dt.getDate()}/${dt.getMonth() + 1}` : wd,
      v: cons === 0 ? 0 : cons - burn, date: d,
    });
  }
  return arr;
}
function netMonthly(diary, sport, spanMonths, partSport = 70, sportMode = "jour", spreadDays = 7, crediterSport = false) {
  const now = new Date();
  const buckets = [];
  for (let i = spanMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ y: d.getFullYear(), m: d.getMonth(), total: 0, days: 0 });
  }
  // Pour le mensuel on itère sur toutes les dates avec des données
  const allDates = new Set([
    ...Object.keys(diary),
    ...Object.keys(sport),
  ]);
  allDates.forEach((date) => {
    const cons = sommeMacros(diary[date]).kcal;
    if (cons <= 0) return;
    const dt = new Date(date);
    const b = buckets.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth());
    if (!b) return;
    const burn = crediterSport ? creditedKcal(date, sport, partSport, sportMode, spreadDays) : Math.round(sommeSport(sport[date]) * (partSport / 100));
    b.total += cons - burn; b.days += 1;
  });
  return buckets.map((b) => ({ label: moisNom[b.m], v: b.days ? Math.round(b.total / b.days) : 0 }));
}
function weekSessions(sportAll, monday) {
  let n = 0;
  for (let i = 0; i < 7; i++) if ((sportAll[shiftDate(monday, i)] || []).length > 0) n++;
  return n;
}
function sportStreak(sportAll, goal) {
  const dow = (new Date(todayISO()).getDay() + 6) % 7;
  const thisMonday = shiftDate(todayISO(), -dow);
  let streak = 0;
  for (let w = 1; w <= 52; w++) {
    if (weekSessions(sportAll, shiftDate(thisMonday, -w * 7)) >= goal) streak++; else break;
  }
  if (weekSessions(sportAll, thisMonday) >= goal) streak++;
  return streak;
}
function sportByWeek(sportAll, nWeeks) {
  const dow = (new Date(todayISO()).getDay() + 6) % 7;
  const thisMonday = shiftDate(todayISO(), -dow);
  const arr = [];
  for (let w = nWeeks - 1; w >= 0; w--) {
    const monday = shiftDate(thisMonday, -w * 7);
    let s = 0;
    for (let i = 0; i < 7; i++) s += sommeSport(sportAll[shiftDate(monday, i)]);
    const dt = new Date(monday);
    arr.push({ label: `${dt.getDate()}/${dt.getMonth() + 1}`, v: Math.round(s) });
  }
  return arr;
}
function sportByMonth(sportAll, nMonths) {
  const now = new Date();
  const buckets = [];
  for (let i = nMonths - 1; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); buckets.push({ y: d.getFullYear(), m: d.getMonth(), total: 0 }); }
  Object.entries(sportAll).forEach(([date, entries]) => { const dt = new Date(date); const b = buckets.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth()); if (b) b.total += sommeSport(entries); });
  return buckets.map((b) => ({ label: moisNom[b.m], v: Math.round(b.total) }));
}
function poidsDataFn(log, gran, span) {
  if (gran === "semaine") {
    const dow = (new Date(todayISO()).getDay() + 6) % 7;
    const start = shiftDate(todayISO(), -dow - (span - 1) * 7);
    return log.filter((p) => p.date >= start).map((p, idx) => {
      const dt = new Date(p.date);
      const wd = joursCourt[dt.getDay()];
      const winStart = shiftDate(p.date, -6);
      const win = log.filter((x) => x.date >= winStart && x.date <= p.date);
      const ma = +(win.reduce((a, x) => a + x.poids, 0) / win.length).toFixed(1);
      return { label: idx === 0 ? `${wd} ${dt.getDate()}/${dt.getMonth() + 1}` : wd, v: p.poids, ma };
    });
  }
  const now = new Date();
  const buckets = [];
  for (let i = span - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ y: d.getFullYear(), m: d.getMonth(), vals: [] });
  }
  log.forEach((p) => {
    const dt = new Date(p.date);
    const b = buckets.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth());
    if (b) b.vals.push(p.poids);
  });
  return buckets.map((b) => ({ label: moisNom[b.m], v: b.vals.length ? +(b.vals.reduce((a, v) => a + v, 0) / b.vals.length).toFixed(1) : null }))
    .filter((x) => x.v != null);
}

/* ============================= PROFIL =========================== */
function Profil({ profil, setProfil, bmr, maintenance, cible, cibleProt, poidsLog, setPoidsLog, onExport, onExportCSV, onImport, onReset, onReplayTutorial, diary, customFoods, favMeals, sport }) {
  const [nouveau, setNouveau] = useState(profil.poids);
  const sortedLog = [...(poidsLog || [])].sort((a, b) => a.date.localeCompare(b.date));
  const [departEdit, setDepartEdit] = useState(sortedLog[0] ? String(sortedLog[0].poids) : "");
  const set = (k) => (v) => setProfil((p) => ({ ...p, [k]: v }));
  const rappels = profil.rappels || DEFAULT_RAPPELS;
  const rr = profil.rappelRepas || { on: true, h: 21, m: 30 };
  function ensureRappels() { return (profil.rappels || DEFAULT_RAPPELS).map((r) => ({ ...r })); }
  function toggleRappel(id) {
    const arr = ensureRappels().map((r) => (r.id === id ? { ...r, on: !r.on } : r));
    if (arr.find((r) => r.id === id).on && typeof Notification !== "undefined") {
      try { Notification.requestPermission(); } catch {}
    }
    set("rappels")(arr);
  }
  function updateRappelTime(id, val) {
    const [h, m] = val.split(":").map(Number);
    set("rappels")(ensureRappels().map((r) => (r.id === id ? { ...r, h, m } : r)));
  }
  const impRef = useRef();

  function enregistrerPoids() {
    const val = Number(nouveau); if (!val) return;
    const d = todayISO();
    setPoidsLog((log) => [...log.filter((e) => e.date !== d), { date: d, poids: val }].sort((a, b) => a.date.localeCompare(b.date)));
    setProfil((p) => ({ ...p, poids: val }));
  }
  function enregistrerDepart() {
    const val = Number(departEdit); if (!val) return;
    setPoidsLog((log) => {
      const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date));
      if (!sorted.length) return [{ date: todayISO(), poids: val }];
      sorted[0] = { ...sorted[0], poids: val };
      return sorted;
    });
  }
  const dernier = sortedLog[sortedLog.length - 1];
  const depart = sortedLog[0];
  const perdu = depart && dernier ? (depart.poids - dernier.poids).toFixed(1) : 0;

  function toggleCredit() {
    setProfil((p) => ({ ...p, crediterSport: !p.crediterSport }));
  }

  const motivationLabel = MOTIVATION[profil.motivation || "perte"]?.label || "Perdre du poids";
  const regimeLabel = REGIME[profil.regime || "omnivore"]?.label || "Omnivore";
  const neatLabel = NEAT[profil.neat || "debout"]?.label || "Souvent debout";
  const sportLabel = SPORT_FREQ[profil.sportFreq || "f1_2"]?.label || "1–2× / semaine";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Carte synthèse — profil scannable en un coup d'œil */}
      <div style={S.cardFramed}>
        <div style={{ ...S.kicker }}>TON PROFIL EN SYNTHÈSE</div>
        <div style={S.kickerTrait} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 12 }}>
          {[
            ["Poids actuel", `${profil.poids} kg`, C.accent],
            ["Objectif", `${profil.objectif} kg`, C.accent],
            ["Taille · Âge", `${profil.taille} cm · ${profil.age} ans`, C.ink],
            ["Sexe", profil.sexe === "homme" ? "Homme" : "Femme", C.ink],
            ["Activité quotidienne", neatLabel, C.ink],
            ["Sport", sportLabel, C.ink],
            ["Motivation", motivationLabel, C.accent],
            ["Régime alimentaire", regimeLabel, C.ink],
          ].map(([l, v, col]) => (
            <div key={l}>
              <div style={{ ...S.sectionLabel, marginBottom: 4, fontSize: 10 }}>{l.toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: col }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.card, background: C.ink, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, display: "flex", alignItems: "center" }}>
              Ta cible quotidienne
              <InfoPop title="Comment est calculée ta cible ?">
                Ta cible = <b>métabolisme de base × facteur d'activité − déficit</b>.
                <br /><br />
                <b>Métabolisme de base</b> ({bmr} kcal) : ce que ton corps brûle au repos pour ses fonctions vitales (respiration, circulation, régulation thermique). Calculé avec la formule <b>Mifflin-St Jeor</b> — la plus précise en clinique.
                <br /><br />
                <b>Facteur d'activité</b> : ton activité quotidienne (NEAT) + fréquence de sport.<br />
                Multiplié = <b>maintenance</b> ({maintenance} kcal) — ce que tu dois manger pour ne pas bouger la balance.
                <br /><br />
                <b>Déficit</b> ({maintenance - cible} kcal/jour) : ta cible réelle = maintenance − déficit. Un déficit doux entraîne une perte durable sans épuisement.
              </InfoPop>
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{cible} <span style={{ fontSize: 16, fontWeight: 500 }}>kcal</span></div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85, lineHeight: 1.8 }}>
            <div>Métabolisme : {bmr}</div><div>Maintenance : {maintenance}</div><div>Protéines/j : {cibleProt} g</div>
          </div>
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>Calcul Mifflin-St Jeor — formule clinique.</div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Motivation principale</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(MOTIVATION).map(([k, v]) => (
            <button key={k} onClick={() => setProfil((p) => ({
              ...p, motivation: k,
              deficit: k === "maintien" ? 0 : k === "prise" ? -300 : (p.motivation === "maintien" || p.motivation === "prise" ? 500 : p.deficit),
            }))}
              style={{ ...S.radioRow, alignItems: "flex-start", ...((profil.motivation || "perte") === k ? S.radioOn : {}) }}>
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block" }}>{v.label}</span>
                <span style={{ ...S.miniMuted, fontSize: 11 }}>{v.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Régime alimentaire</div>
        <div style={{ ...S.miniMuted, marginBottom: 10, fontSize: 12 }}>
          Aide à affiner les suggestions de la saisie libre IA et à ordonner tes aliments favoris.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(REGIME).map(([k, v]) => (
            <button key={k} onClick={() => set("regime")(k)}
              style={{ ...S.radioRow, alignItems: "flex-start", ...((profil.regime || "omnivore") === k ? S.radioOn : {}) }}>
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block" }}>{v.label}</span>
                <span style={{ ...S.miniMuted, fontSize: 11 }}>{v.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ ...S.sectionLabel, display: "flex", alignItems: "center" }}>
          Mon poids actuel
          <InfoPop title="Pourquoi enregistrer mon poids ?">
            Ton poids actuel est la variable la plus importante du calcul : il détermine ton métabolisme (Mifflin-St Jeor multiplie 10 × poids). Quand tu perds ou prends du poids, ta cible évolue automatiquement.
            <br /><br />
            <b>Quand se peser ?</b> Le matin à jeun, après WC, avant café. 2-3× par semaine suffit. Un jour = une variation d'eau. C'est la <b>tendance sur 2-3 semaines</b> qui compte.
          </InfoPop>
        </div>
        <div style={{ ...S.miniMuted, marginBottom: 8, fontSize: 12 }}>Sert au calcul de ta cible calorique. Pèse-toi régulièrement.</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="number" step="0.1" value={nouveau} onChange={(e) => setNouveau(e.target.value)} style={{ ...S.input, flex: 1 }} />
          <span style={{ fontWeight: 700 }}>kg</span>
          <button style={{ ...S.primaryBtn, margin: 0, width: "auto", padding: "12px 16px" }} onClick={enregistrerPoids}>Enregistrer</button>
        </div>
        {depart && (
          <div style={{ ...S.miniMuted, marginTop: 10 }}>
            Depuis le début : <b style={{ color: perdu > 0 ? C.green : C.ink }}>{perdu > 0 ? `−${perdu}` : perdu} kg</b> · départ {depart.poids} kg le {depart.date.split("-").reverse().join("/")}
          </div>
        )}
      </div>

      <div style={S.card}>
        <div style={{ ...S.sectionLabel, display: "flex", alignItems: "center" }}>
          Poids de départ
          <InfoPop title="À quoi sert le poids de départ ?">
            C'est le point de référence pour l'affichage « depuis le début » (les kg perdus/pris). Il n'entre pas dans le calcul de ta cible calorique — seule ta pesée la plus récente compte pour ça.
            <br /><br />
            Modifie-le si tu t'es trompé lors de ton premier enregistrement.
          </InfoPop>
        </div>
        <div style={{ ...S.miniMuted, marginBottom: 8, fontSize: 12 }}>Modifie-le si tu t'es trompé au premier enregistrement. Ça n'affecte pas ta cible (calculée sur le poids actuel), juste l'affichage « depuis le début ».</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="number" step="0.1" value={departEdit} onChange={(e) => setDepartEdit(e.target.value)} style={{ ...S.input, flex: 1 }} />
          <span style={{ fontWeight: 700 }}>kg</span>
          <button style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", color: C.ink, fontSize: 14, fontWeight: 700, cursor: "pointer" }} onClick={enregistrerDepart}>Corriger</button>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Mes infos</div>
        <Field label="Taille (cm)"><input type="number" value={profil.taille} onChange={(e) => set("taille")(Number(e.target.value))} style={S.input} /></Field>
        <Field label="Âge"><input type="number" value={profil.age} onChange={(e) => set("age")(Number(e.target.value))} style={S.input} /></Field>
        <Field label="Sexe">
          <div style={{ display: "flex", gap: 8 }}>
            {["homme", "femme"].map((s) => (
              <button key={s} onClick={() => set("sexe")(s)} style={{ ...S.chip, flex: 1, ...(profil.sexe === s ? S.chipOn : {}) }}>{s}</button>
            ))}
          </div>
        </Field>
        <Field label="Poids objectif (kg)"><input type="number" value={profil.objectif} onChange={(e) => set("objectif")(Number(e.target.value))} style={S.input} /></Field>
      </div>

      <div style={S.card}>
        <div style={{ ...S.sectionLabel, display: "flex", alignItems: "center" }}>
          Activité quotidienne (hors sport)
          <InfoPop title="Qu'est-ce que le NEAT ?">
            <b>NEAT</b> (Non-Exercise Activity Thermogenesis) = toutes les calories que tu brûles <b>hors séances de sport</b> : ton métier, tes trajets, tes tâches ménagères, ton mouvement de fond.
            <br /><br />
            Un employé de bureau brûle bien moins qu'un serveur ou un ouvrier du BTP — c'est pourquoi ta cible s'ajuste à ta réalité, pas à une moyenne théorique.
            <br /><br />
            <b>Multiplicateurs appliqués</b> :<br />
            · Sédentaire × 1,2<br />
            · Souvent debout × 1,35<br />
            · Marche beaucoup × 1,5<br />
            · Travail physique × 1,65
          </InfoPop>
        </div>
        <div style={{ ...S.miniMuted, marginBottom: 10 }}>
          Ton mouvement de fond lié au mode de vie et au métier — sans compter les séances de sport.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(NEAT).map(([k, v]) => (
            <button key={k} onClick={() => set("neat")(k)}
              style={{ ...S.radioRow, alignItems: "flex-start", ...((profil.neat || "debout") === k ? S.radioOn : {}) }}>
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block" }}>{v.label}</span>
                <span style={{ ...S.miniMuted, fontSize: 11 }}>{v.desc}</span>
              </span>
              <span style={{ ...S.miniMuted, flexShrink: 0 }}>×{v.f}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ ...S.sectionLabel, display: "flex", alignItems: "center" }}>
          Fréquence de sport
          <InfoPop title="Fréquence de sport vs. activité quotidienne">
            L'app utilise <b>2 axes</b> qui s'additionnent :
            <br /><br />
            <b>1. Activité quotidienne (NEAT)</b> — ton mouvement de fond (métier, courses, ménage). Constante d'un jour à l'autre.
            <br /><br />
            <b>2. Fréquence de sport</b> — moyenne de tes séances structurées par semaine. C'est une <b>estimation lissée</b> qui te donne une cible stable.
            <br /><br />
            Alternative : active « Créditer le sport » plus bas pour compter chaque séance à sa vraie date (bonus jour par jour). Dans ce cas, remets ici « Aucun / rare » pour ne pas compter deux fois.
          </InfoPop>
        </div>
        <div style={{ ...S.miniMuted, marginBottom: 10 }}>
          Tes séances structurées (padel, muscu, course…), en moyenne sur la semaine. Ça s'ajoute à ton activité quotidienne.
        </div>
        {profil.crediterSport && (
          <div style={{ ...S.miniMuted, marginBottom: 10, background: "#EAF5F6", borderRadius: 10, padding: "8px 10px", color: "#2C7A86" }}>
            Comme tu crédites le sport jour par jour plus bas, mets ici « Aucun / rare » pour ne pas le compter deux fois.
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(SPORT_FREQ).map(([k, v]) => (
            <button key={k} onClick={() => set("sportFreq")(k)}
              style={{ ...S.radioRow, ...((profil.sportFreq || "f1_2") === k ? S.radioOn : {}) }}>
              <span>{v.label}</span><span style={S.miniMuted}>{v.b ? `+${v.b}` : "—"}</span>
            </button>
          ))}
        </div>
        <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 10 }}>
          Total appliqué : ×{(neatF(profil) + sportB(profil)).toFixed(2)} sur ton métabolisme de base.
        </div>
      </div>

      <div style={S.card}>
        <div style={{ ...S.sectionLabel, display: "flex", alignItems: "center" }}>
          Rythme de perte
          <InfoPop title="Quel déficit choisir ?">
            <b>1 kg de gras ≈ 7 700 kcal.</b> Pour perdre 0,5 kg/semaine, il faut donc environ 500 kcal de déficit par jour (500 × 7 = 3 500 ≈ ½ kg).
            <br /><br />
            <b>Repères</b> :<br />
            · 250 kcal/j → 0,25 kg/sem (très doux, invisible)<br />
            · 500 kcal/j → 0,5 kg/sem (recommandé)<br />
            · 750 kcal/j → 0,75 kg/sem (marche mais dur à tenir)
            <br /><br />
            Un <b>déficit modéré (~500)</b> préserve muscle et énergie. Un déficit trop élevé casse la balance hormonale et pousse à craquer — moins d'énergie, plus faim, muscle perdu, effet rebond.
          </InfoPop>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "baseline", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.accent, letterSpacing: "-0.02em" }}>−{profil.deficit}</div>
            <div style={{ ...S.miniMuted, fontSize: 11 }}>kcal / jour</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>−{profil.deficit * 7}</div>
            <div style={{ ...S.miniMuted, fontSize: 11 }}>kcal / semaine</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.positive, letterSpacing: "-0.02em" }}>≈ {(profil.deficit * 7 / 7700).toFixed(2)}</div>
            <div style={{ ...S.miniMuted, fontSize: 11 }}>kg / semaine</div>
          </div>
        </div>
        <input type="range" min="250" max="750" step="50" value={profil.deficit}
          onChange={(e) => set("deficit")(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
        <div style={{ ...S.miniMuted, marginTop: 8, fontSize: 12, lineHeight: 1.5 }}>Un déficit doux (~500 kcal/jour, soit ~3500 kcal/semaine) est le plus tenable dans le temps.</div>
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ maxWidth: "72%" }}>
            <div style={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
              Créditer le sport
              <InfoPop title="Créditer ou pas ?">
                <b>Désactivé (recommandé en perte)</b> : ton sport est déjà pris en compte via « Fréquence de sport » plus haut. Ta cible reste stable, peu importe si tu bouges ou pas ce jour-là.
                <br /><br />
                <b>Activé</b> : chaque séance loggée s'ajoute à ta cible du jour où tu la fais. Utile si tu veux <b>manger plus les jours actifs</b> et moins les jours de repos.
                <br /><br />
                <b>⚠ Piège</b> : les compteurs de calories (Strava, montre) surestiment souvent de 10-20 %. En perte, mieux vaut <b>ne pas créditer</b> ou créditer partiellement (~70 %) pour éviter de « manger tout ce qu'on croit avoir brûlé ». La balance sur 3 semaines te dira si c'est cohérent.
              </InfoPop>
            </div>
            <div style={{ ...S.miniMuted, marginTop: 2 }}>Chaque séance loggée s'ajoute à ta cible, le jour où tu la fais.</div>
          </div>
          <button onClick={toggleCredit}
            style={{ width: 52, height: 30, borderRadius: 16, border: "none", cursor: "pointer", background: profil.crediterSport ? C.green : "#D2DAD2", position: "relative", transition: "background .2s", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 3, left: profil.crediterSport ? 25 : 3, width: 24, height: 24, borderRadius: 12, background: "#fff", transition: "left .2s" }} />
          </button>
        </div>
        {profil.crediterSport && (
          <div style={{ marginTop: 12 }}>
            <div style={S.sectionLabel}>Quand créditer</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              {[["jour", "Le jour même"], ["reparti3", "Sur 3 j"], ["reparti5", "Sur 5 j"], ["reparti7", "Sur 7 j"]].map(([k, l]) => {
                const currentMode = profil.sportMode ?? "jour";
                const currentSpread = profil.sportSpreadDays ?? 7;
                const active = k === "jour"
                  ? currentMode === "jour"
                  : currentMode === "reparti" && currentSpread === Number(k.replace("reparti", ""));
                return (
                  <button key={k} onClick={() => {
                    if (k === "jour") set("sportMode")("jour");
                    else { set("sportMode")("reparti"); set("sportSpreadDays")(Number(k.replace("reparti", ""))); }
                  }}
                    style={{ ...S.chip, flex: "1 1 auto", minWidth: 90, fontSize: 13, ...(active ? S.chipOn : {}) }}>{l}</button>
                );
              })}
            </div>
            <div style={{ ...S.miniMuted, fontSize: 11, marginBottom: 14, lineHeight: 1.5 }}>
              Choisis "sur 5 jours" si tu fais du sport environ 4-5 fois par semaine — ta cible profite du crédit sur les jours "actifs" sans concentrer tout le bonus sur un seul jour.
            </div>

            <div style={{ ...S.sectionLabel, display: "flex", alignItems: "center" }}>
              Part du sport créditée : {profil.partSport ?? 70} %
              <InfoPop title="Pourquoi 70 % et pas 100 % ?">
                Les kcal/h affichées par ta montre, Strava ou une base MET sont des <b>estimations</b> — souvent surestimées de 10 à 20 %, encore plus sur les sports intermittents (padel, HIIT) ou en environnement chaud.
                <br /><br />
                Créditer à <b>70 %</b> = tu appliques une marge de sécurité qui évite de « manger tout ce que tu penses avoir brûlé ». Ça reste motivant tout en gardant la trajectoire de perte.
                <br /><br />
                Ajuste selon ton retour balance : si tu perds trop vite → augmente à 80-90 %. Si tu stagnes → descends à 50-60 %.
              </InfoPop>
            </div>
            <input type="range" min="0" max="100" step="10" value={profil.partSport ?? 70}
              onChange={(e) => set("partSport")(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            <div style={{ ...S.miniMuted, marginTop: 6, lineHeight: 1.55 }}>
              <b>Pourquoi pas 100 % ?</b> Les kcal/h (comme celles de Strava ou d'une montre) surestiment souvent de 10 à 20 % — surtout sur des sports intenses ou intermittents. À {profil.partSport ?? 70} %, tu appliques une petite marge de sécurité pour éviter de "manger tout ce que tu penses avoir brûlé". Autour de 70 % est un bon compromis en perte de poids.
            </div>
            <div style={{ ...S.miniMuted, marginTop: 8, fontSize: 12 }}>
              {(profil.sportMode ?? "jour") === "reparti"
                ? `Exemple : 2h de padel = ~1260 kcal → à ${profil.partSport ?? 70} %, cela ajoute ~${Math.round(1260 * (profil.partSport ?? 70) / 100 / (profil.sportSpreadDays ?? 7))} kcal/jour lissés sur ${profil.sportSpreadDays ?? 7} jours.`
                : `Exemple : 2h de padel = ~1260 kcal → à ${profil.partSport ?? 70} %, tu récupères ~${Math.round(1260 * (profil.partSport ?? 70) / 100)} kcal le jour même.`}
            </div>
          </div>
        )}
        <div style={{ ...S.miniMuted, marginTop: 10, background: C.greenPale, borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>
          {profil.crediterSport ? (
            <>
              <b>Activé.</b> Tes séances loggées s'ajoutent à ta cible du jour. Mets alors ta <i>Fréquence de sport</i> ci-dessus sur « Aucun / rare » pour ne pas compter deux fois — ton activité quotidienne (métier) reste, elle, bien réglée.
              <br /><br />
              À savoir : les kcal/h surestiment un peu — ne vise pas à manger tout le bonus, et laisse la balance sur 3-4 semaines trancher.
            </>
          ) : (
            <>
              <b>Désactivé (recommandé en perte).</b> Ton sport est déjà pris en compte en moyenne via ta <i>Fréquence de sport</i> ci-dessus. Active le crédit seulement si tu préfères logger chaque séance à sa vraie date — pense alors à repasser la fréquence sur « Aucun / rare ».
            </>
          )}
        </div>
      </div>

      <div style={{ ...S.card, background: C.greenPale }}>
        <div style={S.sectionLabel}>Portions repères — assiette « perte »</div>
        {PORTIONS.map((p) => (
          <div key={p.grp} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 6 }}>
            <span style={{ ...S.dot, background: p.couleur, marginTop: 5 }} />
            <div style={{ fontSize: 13 }}><b>{p.grp}</b> — {p.txt}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Sport & récompense</div>
        <div style={{ ...S.miniMuted, background: "#EAF5F6", borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>
          Le sport te récompense par des <b>résultats</b>, pas par de la nourriture : il creuse ton déficit (la balance descend plus vite) et préserve ton muscle (meilleur rendu physique). L'app te le montre dans « Ta semaine sport » (déficit gagné) et dans le graphique « Sport ». Recréditer des calories reste possible ci-dessous, mais c'est optionnel et plutôt déconseillé en perte.
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Rappel du soir</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Repas non complétés</div>
            <input type="time" value={hhmm(rr.h, rr.m)}
              onChange={(e) => { const [h, m] = e.target.value.split(":").map(Number); set("rappelRepas")({ ...rr, h, m }); }}
              style={{ ...S.input, padding: "6px 8px", width: 120, marginTop: 4, opacity: rr.on ? 1 : 0.5 }} />
          </div>
          <button onClick={() => { const on = !rr.on; if (on && typeof Notification !== "undefined") { try { Notification.requestPermission(); } catch (e) {} } set("rappelRepas")({ ...rr, on }); }}
            style={{ width: 52, height: 30, borderRadius: 16, border: "none", cursor: "pointer", background: rr.on ? C.green : "#D2DAD2", position: "relative", transition: "background .2s", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 3, left: rr.on ? 25 : 3, width: 24, height: 24, borderRadius: 12, background: "#fff", transition: "left .2s" }} />
          </button>
        </div>
        <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
          Si le déjeuner, le dîner ou le souper n'est pas rempli, l'app te le rappelle à cette heure. En arrière-plan (app fermée), installe-la sur l'écran d'accueil — fonctionne sur Android, limité sur iPhone.
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Rappels</div>
        {rappels.map((r, i) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i ? "1px solid #F0F2ED" : "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
              <input type="time" value={hhmm(r.h, r.m)} onChange={(e) => updateRappelTime(r.id, e.target.value)}
                style={{ ...S.input, padding: "6px 8px", width: 120, marginTop: 4, opacity: r.on ? 1 : 0.5 }} />
            </div>
            <button onClick={() => toggleRappel(r.id)}
              style={{ width: 52, height: 30, borderRadius: 16, border: "none", cursor: "pointer", background: r.on ? C.green : "#D2DAD2", position: "relative", transition: "background .2s", flexShrink: 0 }}>
              <span style={{ position: "absolute", top: 3, left: r.on ? 25 : 3, width: 24, height: 24, borderRadius: 12, background: "#fff", transition: "left .2s" }} />
            </button>
          </div>
        ))}
        <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
          Les rappels s'affichent quand l'app est ouverte. Une fois installée sur ton écran d'accueil, ils fonctionneront en arrière-plan.
        </div>
      </div>

      {typeof window !== "undefined" && window.NUTRI_ACCOUNT && (
        <div style={S.card}>
          <div style={S.sectionLabel}>Compte</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis" }}>{window.NUTRI_ACCOUNT.email}</div>
            <button onClick={() => window.NUTRI_ACCOUNT.logout()}
              style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #E1E6DC", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: C.ink, flexShrink: 0 }}>Se déconnecter</button>
          </div>
          <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>Tes données sont synchronisées entre tes appareils.</div>
        </div>
      )}

      <div style={S.card}>
        <div style={S.sectionLabel}>Aide</div>
        <button onClick={onReplayTutorial}
          style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", color: C.green, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Revoir le tutoriel
        </button>
      </div>

      <BadgesCard diary={diary} profil={profil} poidsLog={poidsLog}
        customFoods={customFoods} favMeals={favMeals} sport={sport} />

      <FAQ />


      <div style={S.card}>
        <div style={S.sectionLabel}>Sauvegarde</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...S.primaryBtn, marginTop: 0, flex: 1, background: C.ink }} onClick={onExport}>Exporter</button>
          <button style={{ ...S.primaryBtn, marginTop: 0, flex: 1, background: "#6B8F71" }} onClick={() => impRef.current.click()}>Importer</button>
        </div>
        <input ref={impRef} type="file" accept="application/json" style={{ display: "none" }}
          onChange={(e) => { if (e.target.files[0]) onImport(e.target.files[0]); }} />
        <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
          Télécharge un fichier .json avec toutes tes données (repas, poids, sport, aliments, favoris). À réimporter en cas de changement de téléphone.
        </div>
        <button onClick={onExportCSV}
          style={{ width: "100%", marginTop: 12, padding: "12px 0", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", color: C.ink, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Exporter le journal en CSV
        </button>
        <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 6 }}>
          Un fichier .csv lisible dans Excel / Numbers / Google Sheets — une ligne par aliment consommé.
        </div>
        <button onClick={onReset}
          style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 12, border: `1px solid ${C.red}`, background: "#fff", color: C.red, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Réinitialiser toutes les données
        </button>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Mise à jour</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 13 }}>Version installée : <b>{VERSION}</b></div>
          <button onClick={async () => {
            if (typeof window === "undefined" || !window.NUTRI_UPDATE) { window.alert("Mise à jour indisponible ici."); return; }
            const r = await window.NUTRI_UPDATE.check();
            if (r === "updating") window.alert("Nouvelle version détectée — rechargement…");
            else if (r === "up-to-date") window.alert("Tu es déjà sur la dernière version ✓");
            else window.alert("Impossible de vérifier. Réessaie plus tard.");
          }}
            style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", color: C.green, fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            Rechercher une mise à jour
          </button>
        </div>
        <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
          L'app se met à jour toute seule au prochain lancement. Ce bouton force la vérification maintenant.
        </div>
      </div>

      <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "0 20px 8px" }}>
        Valeurs caloriques = moyennes de référence (type CIQUAL). Un outil de suivi ne remplace pas un professionnel de santé.
      </div>
    </div>
  );
}

/* ------------------------- Petits éléments ------------------------- */
function MealPhoto({ photo, onSet, onClear, compact }) {
  const ref = useRef();
  function handle(e) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 520, scale = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = img.width * scale; cv.height = img.height * scale;
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        onSet(cv.toDataURL("image/jpeg", 0.6));
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(file);
  }
  if (compact) {
    return photo ? (
      <div style={{ position: "relative", width: 34, height: 34, flexShrink: 0 }}>
        <img src={photo} alt="" style={{ width: 34, height: 34, borderRadius: 9, objectFit: "cover", display: "block" }} />
        <button onClick={onClear} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: 9, border: "none", background: "rgba(23,36,28,.78)", color: "#fff", fontSize: 12, lineHeight: 1, cursor: "pointer" }}>×</button>
      </div>
    ) : (
      <label style={{ width: 34, height: 34, borderRadius: 9, border: "1px dashed #C7D2C6", background: "#FAFBF8", display: "grid", placeItems: "center", cursor: "pointer", fontSize: 15, flexShrink: 0 }} title="Photo du repas">
        📷
        <input type="file" accept="image/*" onChange={handle} style={{ display: "none" }} />
      </label>
    );
  }
  return (
    <div style={{ marginBottom: 8 }}>
      {photo ? (
        <div style={{ position: "relative" }}>
          <img src={photo} alt="" style={{ width: "100%", maxHeight: 170, objectFit: "cover", borderRadius: 12, display: "block" }} />
          <button onClick={onClear} style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 8, border: "none", background: "rgba(23,36,28,.6)", color: "#fff", fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
      ) : (
        <label style={{ display: "block", width: "100%", padding: "9px 0", borderRadius: 12, border: "1px dashed #C7D2C6", background: "#FAFBF8", fontSize: 13, cursor: "pointer", color: C.green, fontWeight: 600, textAlign: "center", boxSizing: "border-box" }}>
          📷 Photo du repas
          <input type="file" accept="image/*" onChange={handle} style={{ display: "none" }} />
        </label>
      )}
    </div>
  );
}
function Field({ label, children }) {
  return <div style={{ marginBottom: 12 }}><div style={{ ...S.miniMuted, marginBottom: 4 }}>{label}</div>{children}</div>;
}

/* Petit "?" cliquable → pop-up avec une explication détaillée. */
function InfoPop({ title, children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <span style={{ position: "relative", display: "inline-block", verticalAlign: "middle" }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        title={title || "Plus d'infos"}
        style={{ marginLeft: 6, width: 16, height: 16, border: `1px solid ${C.divider}`, background: open ? C.accent : "#fff", color: open ? "#fff" : C.muted, fontSize: 10, cursor: "pointer", padding: 0, borderRadius: 0, fontWeight: 800, lineHeight: 1, fontFamily: "'Archivo', sans-serif", display: "inline-grid", placeItems: "center", verticalAlign: "middle" }}>?</button>
      {open && (
        <div onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", border: `2px solid ${C.ink}`, minWidth: 280, maxWidth: 360, padding: 14, zIndex: 40, boxShadow: "0 6px 20px rgba(0,0,0,.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
            {title && <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em", flex: 1 }}>{title}</div>}
            <button onClick={() => setOpen(false)} style={{ ...S.del, flexShrink: 0 }}>×</button>
          </div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{children}</div>
        </div>
      )}
    </span>
  );
}
const FAQ_ITEMS = [
  {
    q: "Comment est calculée ma cible calorique ?",
    a: "Elle est calculée en 3 étapes : (1) ton métabolisme de base via la formule Mifflin-St Jeor (utilise poids, taille, âge, sexe) ; (2) multiplication par ton facteur d'activité (NEAT × sport) pour obtenir ta maintenance ; (3) soustraction du déficit choisi. Résultat : la cible affichée en haut du Profil. Toutes les variables sont modifiables et le calcul se refait instantanément.",
  },
  {
    q: "Pourquoi la formule Mifflin-St Jeor ?",
    a: "C'est la formule la plus précise pour la population générale (~5 % plus précise que Harris-Benedict d'après les études). Elle est standardisée en clinique et ne demande que 4 variables faciles à mesurer (poids, taille, âge, sexe). Elle sous-estime légèrement chez les personnes très musclées (Katch-McArdle serait alors plus juste, mais nécessite le taux de masse grasse).",
  },
  {
    q: "Est-ce grave si je dépasse ma cible un jour ?",
    a: "Non. Une journée ne fait ni ne défait la perte de poids : c'est la moyenne sur 7-14 jours qui compte. 500 kcal de dépassement un jour = 70 kcal de plus par jour lissés sur la semaine, soit environ 10 g de gras. Le vrai risque, c'est de baisser les bras après un écart. Continue normalement le lendemain.",
  },
  {
    q: "Comment savoir si mon rythme est le bon ?",
    a: "Compare la projection (dans Graphique > Bilan 7 j) avec ce que dit ta balance sur 2-3 semaines. Si l'écart réel de la balance est plus lent que la projection → tu manges plus que tu ne crois ou tu bouges moins. Ajuste de 100-200 kcal. Ne juge jamais sur 3 jours : les variations d'eau et de glycogène brouillent le signal.",
  },
  {
    q: "Puis-je perdre plus vite qu'0,5 kg / semaine ?",
    a: "Oui mais pas conseillé. Au-delà de 0,7-1 kg/sem, tu perds surtout du muscle et de l'eau, tu affames ton métabolisme, tu craques plus vite, et l'effet rebond est quasi garanti à la reprise. Un déficit modéré (500 kcal/j) sur 2-3 mois donne des résultats plus stables qu'un régime « choc » sur 2 semaines.",
  },
  {
    q: "Faut-il compter les calories brûlées en sport ?",
    a: "Deux écoles. Option 1 (conseillée en perte) : les compter en amont via « Fréquence de sport » — ta cible reste stable. Option 2 : activer « Créditer le sport » — les kcal des séances loggées s'ajoutent à ta cible du jour. C'est motivant mais risqué car les compteurs de montre surestiment de 10-20 %. En perte, garde une marge (créditer à 70 %).",
  },
  {
    q: "Pourquoi mes protéines ont-elles une cible spéciale ?",
    a: "1,8 g/kg de poids corporel = suffisant pour préserver le muscle en déficit calorique (études sur athlètes et populations en régime hypocalorique). Le muscle est ton meilleur allié : il maintient ton métabolisme, sculpte ta silhouette, protège les articulations. Vise ce chiffre en priorité — les glucides et lipides suivent selon ce qui reste.",
  },
  {
    q: "Le scan de code-barres ne marche pas — que faire ?",
    a: "Sur iPhone (Safari) et sur beaucoup de PC, le lecteur caméra direct n'est pas dispo (limitation du navigateur, pas de l'app). Solutions : (1) prendre une photo du code-barres avec le bouton « Choisir / prendre une photo » dans la fenêtre du scanner ; (2) taper les 13 chiffres à la main. Le produit sera cherché dans Open Food Facts dans les 3 cas.",
  },
  {
    q: "Mes données sont-elles privées ?",
    a: "Oui. Tes repas, poids, sport et réglages sont stockés dans ton espace Firestore privé (accessible uniquement avec ton mot de passe). Seuls les codes-barres et aliments encodés à la main sont partagés dans une base commune anonymisée (pour que la liste grossisse pour tout le monde). Aucune donnée personnelle nominative n'y figure.",
  },
  {
    q: "Comment repartir à zéro / changer d'objectif ?",
    a: "Modifier tes cibles : Profil → change poids, objectif, activité, déficit. Le calcul se refait immédiatement, sans perdre l'historique. Repartir à zéro complètement : Profil → Sauvegarde → « Réinitialiser toutes les données » (irréversible — pense à exporter d'abord).",
  },
];

function BadgesCard({ diary, profil, poidsLog, customFoods, favMeals, sport }) {
  const stats = useMemo(() => computeBadgeStats({ diary, profil, poidsLog, customFoods, favMeals, sport }),
    [diary, profil, poidsLog, customFoods, favMeals, sport]);
  const unlocked = BADGES.filter((b) => b.test(stats));
  const locked = BADGES.filter((b) => !b.test(stats));

  const Card = ({ b, on }) => (
    <div style={{ padding: 12, border: `1px solid ${on ? C.accent : C.divider}`, background: on ? C.accentTint : "#fff", opacity: on ? 1 : 0.55 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: on ? C.accent : C.muted }}>
        {on ? "✓ DÉBLOQUÉ" : "À DÉBLOQUER"}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginTop: 4, letterSpacing: "-0.01em" }}>{b.t}</div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{b.d}</div>
    </div>
  );

  return (
    <div style={S.cardFramed}>
      <div style={S.kicker}>BADGES · {unlocked.length}/{BADGES.length}</div>
      <div style={S.kickerTrait} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }}>
        {unlocked.map((b) => <Card key={b.id} b={b} on={true} />)}
        {locked.map((b) => <Card key={b.id} b={b} on={false} />)}
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div style={S.cardFramed}>
      <div style={{ ...S.kicker }}>FAQ — QUESTIONS COURANTES</div>
      <div style={S.kickerTrait} />
      {FAQ_ITEMS.map((it, i) => (
        <div key={i} style={{ borderTop: i === 0 ? "none" : `1px solid ${C.divider}` }}>
          <button onClick={() => setOpen((o) => (o === i ? null : i))}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Archivo', sans-serif" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: open === i ? C.accent : C.ink, flex: 1, paddingRight: 12 }}>{it.q}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.accent, width: 20, textAlign: "center", flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, paddingBottom: 14, paddingRight: 32 }}>
              {it.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MacroPill({ label, v, cible, min, unit, couleur }) {
  return (
    <div style={{ flex: 1, background: "#F6F8F3", border: "1.5px solid #E0E6DA", borderRadius: 12, padding: "8px 10px" }}>
      <div style={{ fontSize: 11, color: C.muted }}>{label}</div>
      <div style={{ fontWeight: 700, color: couleur }}>{Math.round(v)}{cible ? `/${cible}` : ""}{unit}</div>
      {min ? <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>min {min}{unit}</div> : null}
    </div>
  );
}
function Barre({ value, max, couleur }) {
  const pct = Math.min(100, (value / max) * 100);
  return <div style={{ height: 10, background: "#EBEFE8", borderRadius: 6, marginTop: 12, overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, height: "100%", background: couleur, borderRadius: 6, transition: "width .3s" }} /></div>;
}
function RingSmall({ value, max }) {
  const pct = Math.min(100, (value / max) * 100), r = 20, circ = 2 * Math.PI * r;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#EBEFE8" strokeWidth="6" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={pct > 100 ? C.red : C.green} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - (circ * pct) / 100} transform="rotate(-90 26 26)" style={{ transition: "stroke-dashoffset .4s" }} />
      <text x="26" y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>{Math.round(pct)}%</text>
    </svg>
  );
}
function Legend({ couleur, txt, dash }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
      <span style={{ width: 14, height: dash ? 0 : 8, borderRadius: 3, background: dash ? "none" : couleur, borderTop: dash ? `2px dashed ${couleur}` : "none" }} />{txt}
    </div>
  );
}
const SLIDES = [
  { key: "welcome", t: "Bienvenue sur NutriSuivi", d: "Ton carnet nutritionnel simple et honnête. Suis tes repas et ton poids sans te prendre la tête — et sans chiffres gravés dans le marbre." },
  { key: "agenda", t: "L'agenda du jour", d: "Chaque jour : ta cible en gros chiffre, tes 4 repas (Déjeuner, Collation, Dîner, Souper) et ton sport. Une jauge sous ta cible te dit visuellement où tu en es." },
  { key: "add", t: "Ajouter un repas — 4 façons", d: "Liste officielle (valeurs vérifiées par CIQUAL — la base nutritionnelle de l'ANSES, agence française de sécurité alimentaire), code-barres, estimation par photo (IA), ou saisie libre. Les portions courantes s'affichent en un tap : « 1 pot = 150 g », « 1 part = 250 g »." },
  { key: "scan", t: "🎯 LE code-barres : la méthode la plus PRÉCISE, point.", d: "Photo ou scan live du code-barres → l'app va chercher dans Open Food Facts (+3M produits, belges inclus) et te propose une fiche prête à valider en 2 secondes, avec des valeurs vérifiées par le fabricant. C'est le seul moyen d'être sûr à 100 % de tes chiffres — pas d'estimation, pas d'IA, pas de doute. Pour tes yaourts, céréales, biscuits, plats préparés → toujours scanner." },
  { key: "database", t: "🌍 Ta liste grossit toute seule, grâce à toi et grâce aux autres", d: "Chaque produit scanné ou encodé rejoint une base commune à tous les utilisateurs. Résultat : plus on est nombreux, plus ta liste grossit sans que tu fasses rien. Le lendemain d'installation, tu retrouves déjà les produits scannés par d'autres. C'est LA killer feature : le scan est ultra-précis, la communauté s'entraide, et ta contribution (même une !) enrichit la base pour tous. Plus l'appli grandit, plus elle devient utile." },
  { key: "weeklyAI", t: "✨ Analyse IA hebdo — un coach à ton poignet", d: "Chaque semaine, un mini bilan pédagogique généré par une IA nutritionniste : ce qui a marché, ce qui accroche, une action concrète pour la semaine suivante. Basé sur TES vraies données (repas, sport, poids), pas des généralités. C'est comme avoir un coach qui relit ton carnet et te souligne les 3 choses importantes — sans jargon, sans culpabilisation." },
  { key: "graph", t: "Le graphique", d: "Suis tes calories, ton bilan net (mangé − dépensé), ta courbe de poids lissée et le déficit creusé par ton sport — par semaine ou par mois. Ligne pointillée = ta cible." },
  { key: "profil", t: "Ton profil", d: "Ta cible se calcule à partir de ton profil (poids, taille, âge, activité, sport) — pas d'algorithme mystère. Le sport te récompense par des résultats concrets — physique plus tonique, muscle préservé — plus que par une assiette en plus. Pèse-toi régulièrement pour ajuster : c'est la tendance sur 2-3 semaines qui compte, jamais le chiffre d'un jour." },
];

/* Mini-mockups animés SVG représentant chaque écran de l'app. */
function SlideVisual({ slideKey }) {
  const accent = "#235C86", ink = "#201E1D", bg = "#F3F2F2", divider = "rgba(32,30,29,.14)", muted = "rgba(32,30,29,.52)";
  const W = 320, H = 200;
  const styleAnim = {
    "@keyframes slideJauge": "0%{width:0}100%{width:60%}",
    "@keyframes fadeUp": "0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}",
  };
  const wrap = (children) => (
    <div style={{ marginTop: 22, background: bg, padding: 16, border: `2px solid ${divider}` }}>
      <style>{`
        @keyframes ns-slide-jauge { from { width: 0 } to { width: 66% } }
        @keyframes ns-fade-up { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes ns-bar-grow { from { height: 0 } to { height: var(--h) } }
        @keyframes ns-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .4 } }
        @keyframes ns-scan-line { 0% { top: 15% } 50% { top: 85% } 100% { top: 15% } }
      `}</style>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", fontFamily: "'Archivo', sans-serif" }}>
        {children}
      </svg>
    </div>
  );

  if (slideKey === "welcome") {
    return wrap(
      <>
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        <text x={W/2} y="70" textAnchor="middle" fontSize="24" fontWeight="800" fill={ink} letterSpacing="-0.02em">NutriSuivi</text>
        <rect x={W/2 - 22} y="82" width="44" height="3" fill={accent} />
        <text x={W/2} y="115" textAnchor="middle" fontSize="11" fill={muted} letterSpacing="0.14em">CARNET NUTRITIONNEL</text>
        <g style={{ animation: "ns-fade-up 1.2s ease-out" }}>
          <text x={W/2} y="155" textAnchor="middle" fontSize="42" fontWeight="800" fill={accent} letterSpacing="-0.02em">1247</text>
          <text x={W/2} y="175" textAnchor="middle" fontSize="10" fill={muted}>kcal restantes</text>
        </g>
      </>
    );
  }

  if (slideKey === "agenda") {
    return wrap(
      <>
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        {/* Kicker */}
        <text x="16" y="24" fontSize="9" fontWeight="700" fill={accent} letterSpacing="0.14em">AUJOURD'HUI</text>
        <rect x="16" y="28" width="30" height="2" fill={accent} />
        {/* Big number */}
        <text x="16" y="70" fontSize="36" fontWeight="800" fill={accent} letterSpacing="-0.02em">1247</text>
        <text x="16" y="86" fontSize="9" fill={muted}>kcal restantes · 47%</text>
        {/* Jauge animée */}
        <rect x="16" y="98" width="240" height="4" fill={divider} />
        <rect x="16" y="98" height="4" fill={accent} style={{ animation: "ns-slide-jauge 1.6s ease-out forwards", width: 0 }} />
        {/* Meals */}
        {[{ y: 122, l: "Déjeuner", k: "388" }, { y: 144, l: "Collation", k: "62" }, { y: 166, l: "Dîner", k: "540" }].map((r, i) => (
          <g key={i} style={{ animation: `ns-fade-up 0.5s ease-out ${0.2 + i * 0.15}s backwards` }}>
            <rect x="16" y={r.y} width="6" height="6" fill={accent} />
            <text x="30" y={r.y + 6} fontSize="11" fontWeight="700" fill={ink}>{r.l}</text>
            <text x="256" y={r.y + 6} textAnchor="end" fontSize="11" fontWeight="700" fill={ink}>{r.k} kcal</text>
            <line x1="16" y1={r.y + 12} x2="256" y2={r.y + 12} stroke={divider} />
          </g>
        ))}
      </>
    );
  }

  if (slideKey === "add") {
    return wrap(
      <>
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        <text x="16" y="24" fontSize="12" fontWeight="800" fill={ink}>Ajouter · Skyr nature</text>
        <rect x="16" y="34" width="200" height="26" fill={bg} stroke={divider} />
        <text x="24" y="52" fontSize="10" fill={muted}>Rechercher un aliment…</text>
        {/* Rows */}
        {[
          { y: 76, n: "Skyr nature", p: "(1 pot = 150 g)" },
          { y: 102, n: "Pomme", p: "(1 moyenne = 150 g)" },
          { y: 128, n: "Lasagne", p: "(1 part = 250 g)" },
          { y: 154, n: "Pain complet", p: "(1 tranche = 40 g)" },
        ].map((r, i) => (
          <g key={i} style={{ animation: `ns-fade-up 0.5s ease-out ${0.1 + i * 0.12}s backwards` }}>
            <rect x="16" y={r.y - 2} width="6" height="6" fill={accent} />
            <text x="30" y={r.y + 4} fontSize="11" fontWeight="700" fill={ink}>{r.n}</text>
            <text x={30 + r.n.length * 6.2} y={r.y + 4} fontSize="10" fill={muted}>{r.p}</text>
            <line x1="16" y1={r.y + 14} x2="304" y2={r.y + 14} stroke={divider} />
          </g>
        ))}
      </>
    );
  }

  if (slideKey === "scan") {
    return wrap(
      <>
        {/* Bloc caméra à gauche */}
        <rect x="0" y="0" width="160" height={H} fill={ink} />
        <rect x="20" y="30" width="120" height="140" fill="none" stroke="#fff" strokeWidth="2" opacity="0.9" />
        <rect x="30" y="50" width="100" height="100" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />
        <g transform="translate(45, 85)" style={{ animation: "ns-pulse 2s ease-in-out infinite" }}>
          {[0, 5, 8, 14, 22, 28, 32, 42, 48, 56, 62, 70].map((x, i) => (
            <rect key={i} x={x} y="0" width={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1} height="30" fill="#fff" />
          ))}
        </g>
        <rect x="20" y="0" width="120" height="2" fill={accent}
          style={{ animation: "ns-scan-line 2.4s ease-in-out infinite", position: "relative" }} />
        <text x="80" y="190" textAnchor="middle" fontSize="9" fill="#fff" opacity="0.7">Vise le code</text>

        {/* Flèche */}
        <text x="170" y="105" fontSize="16" fontWeight="800" fill={accent}>→</text>

        {/* Fiche produit à droite */}
        <rect x="190" y="30" width="120" height="140" fill="#fff" stroke={divider} strokeWidth="1.5" />
        <g style={{ animation: "ns-fade-up 1s ease-out 0.8s backwards" }}>
          <text x="200" y="50" fontSize="8" fontWeight="700" fill={accent} letterSpacing="0.1em">TROUVÉ</text>
          <rect x="200" y="54" width="16" height="2" fill={accent} />
          <text x="200" y="72" fontSize="10" fontWeight="800" fill={ink}>Skyr nature</text>
          <text x="200" y="84" fontSize="7" fill={muted}>Arla · 150 g</text>
          <line x1="200" y1="94" x2="300" y2="94" stroke={divider} />
          <text x="200" y="112" fontSize="20" fontWeight="800" fill={accent} letterSpacing="-0.02em">95</text>
          <text x="228" y="112" fontSize="8" fill={muted}>kcal</text>
          <text x="200" y="132" fontSize="8" fill={muted}>P 15 · G 6 · L 0,2</text>
          <rect x="200" y="146" width="100" height="16" fill={accent} />
          <text x="250" y="157" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">Ajouter</text>
        </g>
      </>
    );
  }

  if (slideKey === "database") {
    // 3 utilisateurs contribuent → base commune → chaque utilisateur en profite.
    const cx1 = 60, cx2 = 260, cxBase = 160;
    return wrap(
      <>
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        <text x="16" y="20" fontSize="9" fontWeight="700" fill={accent} letterSpacing="0.14em">BASE COMMUNAUTAIRE</text>
        <rect x="16" y="24" width="30" height="2" fill={accent} />

        {/* 3 users à gauche */}
        {[
          { y: 60, n: "Léa scan un yaourt" },
          { y: 92, n: "Marc ajoute son plat" },
          { y: 124, n: "Sofia scan des céréales" },
        ].map((u, i) => (
          <g key={i} style={{ animation: `ns-fade-up 0.5s ease-out ${0.1 + i * 0.2}s backwards` }}>
            <circle cx={cx1 - 10} cy={u.y} r="7" fill={accent} />
            <text x={cx1 + 2} y={u.y + 4} fontSize="10" fontWeight="600" fill={ink}>{u.n}</text>
            <line x1={cx1 + 116} y1={u.y} x2={cxBase - 8} y2={102} stroke={accent} strokeWidth="1" opacity="0.4" />
          </g>
        ))}

        {/* Base au centre */}
        <g style={{ animation: "ns-pulse 2.5s ease-in-out infinite" }}>
          <rect x={cxBase - 6} y="86" width="14" height="34" fill={accent} />
          <ellipse cx={cxBase} cy="86" rx="7" ry="3" fill={accent} />
          <ellipse cx={cxBase} cy="103" rx="7" ry="3" fill={accent} opacity="0.6" />
          <ellipse cx={cxBase} cy="120" rx="7" ry="3" fill={accent} opacity="0.4" />
        </g>
        <text x={cxBase} y="140" textAnchor="middle" fontSize="8" fontWeight="700" fill={accent} letterSpacing="0.08em">DB PARTAGÉE</text>

        {/* Utilisateur "toi" à droite qui reçoit */}
        <line x1={cxBase + 8} y1="102" x2={cx2 - 8} y2="102" stroke={accent} strokeWidth="1" opacity="0.4" />
        <g style={{ animation: "ns-fade-up 0.6s ease-out 0.9s backwards" }}>
          <circle cx={cx2 + 3} cy="102" r="10" fill={ink} />
          <text x={cx2 + 3} y="106" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">TOI</text>
        </g>

        {/* Bandeau bas */}
        <line x1="16" y1="160" x2={W - 16} y2="160" stroke={divider} strokeWidth="2" />
        <text x={W/2} y="180" textAnchor="middle" fontSize="10" fontWeight="700" fill={ink}>+ de scans par la communauté = ta liste qui grossit toute seule</text>
      </>
    );
  }

  if (slideKey === "weeklyAI") {
    return wrap(
      <>
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        <text x="16" y="20" fontSize="9" fontWeight="700" fill={accent} letterSpacing="0.14em">ANALYSE IA · SEMAINE 33</text>
        <rect x="16" y="24" width="30" height="2" fill={accent} />

        <g style={{ animation: "ns-fade-up 0.6s ease-out 0.1s backwards" }}>
          <text x="16" y="52" fontSize="8" fontWeight="700" fill={accent} letterSpacing="0.1em">✓ CE QUI A MARCHÉ</text>
          <text x="16" y="66" fontSize="10" fill={ink}>Cible respectée 6/7 jours,</text>
          <text x="16" y="78" fontSize="10" fill={ink}>protéines top (moy 158 g).</text>
        </g>
        <line x1="16" y1="90" x2="304" y2="90" stroke={divider} />

        <g style={{ animation: "ns-fade-up 0.6s ease-out 0.35s backwards" }}>
          <text x="16" y="106" fontSize="8" fontWeight="700" fill={accent} letterSpacing="0.1em">⚠ CE QUI ACCROCHE</text>
          <text x="16" y="120" fontSize="10" fill={ink}>Les soirées glissent :</text>
          <text x="16" y="132" fontSize="10" fill={ink}>+210 kcal en moy après 19h.</text>
        </g>
        <line x1="16" y1="144" x2="304" y2="144" stroke={divider} />

        <g style={{ animation: "ns-fade-up 0.6s ease-out 0.6s backwards" }}>
          <text x="16" y="160" fontSize="8" fontWeight="700" fill={accent} letterSpacing="0.1em">→ ACTION SIMPLE</text>
          <text x="16" y="174" fontSize="10" fill={ink}>Décale ta collation à 16h30</text>
          <text x="16" y="186" fontSize="10" fill={ink}>pour couper la faim du soir.</text>
        </g>
      </>
    );
  }

  if (slideKey === "graph") {
    const bars = [{ h: 60, v: "1980" }, { h: 92, v: "2240", over: true }, { h: 42, v: "1760" }, { h: 70, v: "2090" }, { h: 88, v: "2310", over: true }, { h: 56, v: "1890" }, { h: 48, v: "1720" }];
    return wrap(
      <>
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        <text x="16" y="20" fontSize="9" fontWeight="700" fill={accent} letterSpacing="0.14em">CALORIES · 7 J</text>
        <rect x="16" y="24" width="30" height="2" fill={accent} />
        <text x="16" y="52" fontSize="24" fontWeight="800" fill={accent} letterSpacing="-0.02em">1990</text>
        <text x="70" y="52" fontSize="10" fill={muted}>kcal / j</text>
        {/* Axes */}
        <line x1="16" y1="170" x2={W-16} y2="170" stroke={divider} strokeWidth="1" />
        {/* Bars */}
        {bars.map((b, i) => (
          <rect key={i} x={30 + i * 40} y={170 - b.h} width="24" height={b.h}
            fill={b.over ? "#C0562B" : accent}
            style={{ transformOrigin: `${30 + i * 40 + 12}px 170px`, animation: `ns-bar-grow 1s ease-out ${0.15 + i * 0.1}s backwards`, "--h": `${b.h}px` }} />
        ))}
        {/* Cible line */}
        <line x1="16" y1="90" x2={W-16} y2="90" stroke={accent} strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={W-16} y="86" textAnchor="end" fontSize="9" fontWeight="700" fill={accent}>Cible 2174</text>
      </>
    );
  }

  if (slideKey === "profil") {
    return wrap(
      <>
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        <text x="16" y="24" fontSize="10" fontWeight="700" fill={muted} letterSpacing="0.12em">TA CIBLE</text>
        <text x="16" y="60" fontSize="36" fontWeight="800" fill={accent} letterSpacing="-0.02em">2174</text>
        <text x="130" y="60" fontSize="12" fill={muted}>kcal / jour</text>
        <line x1="16" y1="80" x2={W-16} y2="80" stroke={divider} strokeWidth="2" />
        {/* Metrics */}
        <g style={{ animation: "ns-fade-up 0.6s ease-out 0.2s backwards" }}>
          <text x="16" y="106" fontSize="10" fill={muted}>Métabolisme</text>
          <text x={W-16} y="106" textAnchor="end" fontSize="12" fontWeight="700" fill={ink}>1834</text>
          <line x1="16" y1="114" x2={W-16} y2="114" stroke={divider} />
        </g>
        <g style={{ animation: "ns-fade-up 0.6s ease-out 0.35s backwards" }}>
          <text x="16" y="134" fontSize="10" fill={muted}>Maintenance</text>
          <text x={W-16} y="134" textAnchor="end" fontSize="12" fontWeight="700" fill={ink}>2674</text>
          <line x1="16" y1="142" x2={W-16} y2="142" stroke={divider} />
        </g>
        <g style={{ animation: "ns-fade-up 0.6s ease-out 0.5s backwards" }}>
          <text x="16" y="162" fontSize="10" fill={muted}>Déficit / jour</text>
          <text x={W-16} y="162" textAnchor="end" fontSize="12" fontWeight="700" fill={accent}>−500 kcal</text>
        </g>
      </>
    );
  }
  return null;
}
function SlideShot({ name }) {
  const [ok, setOk] = useState(true);
  if (!name || !ok) return null;
  return <img src={`./screens/${name}`} onError={() => setOk(false)} alt=""
    style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 16, border: "2px solid #E0E6DA", marginTop: 22, boxShadow: "0 8px 24px rgba(23,36,28,.14)" }} />;
}
function Onboarding({ onDone }) {
  const [i, setI] = useState(0);
  const s = SLIDES[i];
  const last = i === SLIDES.length - 1;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: C.bg, display: "flex", flexDirection: "column", fontFamily: "'Archivo',system-ui,sans-serif", color: C.ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: `2px solid ${C.divider}` }}>
        <div style={{ ...S.logo, fontSize: 16 }}>NutriSuivi</div>
        <button onClick={onDone} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "'Archivo', sans-serif" }}>Passer</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={S.kicker}>ÉTAPE {i + 1} / {SLIDES.length}</div>
        <div style={S.kickerTrait} />
        <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.15 }}>{s.t}</div>
        <div style={{ fontSize: 15, color: C.muted, marginTop: 14, lineHeight: 1.6 }}>{s.d}</div>
        <SlideVisual slideKey={s.key} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "22px 0 14px" }}>
        {SLIDES.map((_, k) => (
          <span key={k} style={{ width: k === i ? 22 : 8, height: 4, background: k === i ? C.accent : C.divider, transition: "width .2s" }} />
        ))}
      </div>
      <div style={{ padding: "0 24px 30px", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", gap: 10 }}>
        {i > 0 && (
          <button onClick={() => setI(i - 1)}
            style={{ padding: "14px 22px", border: `1px solid ${C.divider}`, background: "#fff", color: C.ink, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Archivo', sans-serif", borderRadius: 0 }}>‹</button>
        )}
        <button onClick={() => (last ? onDone() : setI(i + 1))}
          style={{ flex: 1, padding: "14px 0", border: "none", background: C.accent, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Archivo', sans-serif", borderRadius: 0, letterSpacing: "0.02em" }}>
          {last ? "Commencer" : "Suivant"}
        </button>
      </div>
    </div>
  );
}
function Assistant({ profil, setProfil, onDone }) {
  const [f, setF] = useState({ ...profil });
  const up = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  function save() {
    setProfil((p) => ({
      ...p, sexe: f.sexe, age: Number(f.age) || p.age, taille: Number(f.taille) || p.taille,
      poids: Number(f.poids) || p.poids, objectif: Number(f.objectif) || p.objectif, neat: f.neat, sportFreq: f.sportFreq,
      motivation: f.motivation || "perte", regime: f.regime || "omnivore",
    }));
    onDone();
  }
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #E1E6DC", fontSize: 15, background: "#FAFBF8", boxSizing: "border-box", outline: "none" };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 110, background: C.bg, overflowY: "auto", fontFamily: "'Inter',system-ui,sans-serif", color: C.ink }}>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "28px 22px 40px" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 26, textAlign: "center" }}>Nutri<span style={{ color: C.amber }}>Suivi</span></div>
        <div style={{ color: C.muted, fontSize: 14, textAlign: "center", marginTop: 4, marginBottom: 22 }}>Réglons ton profil en 30 secondes</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["homme", "Homme"], ["femme", "Femme"]].map(([k, l]) => (
            <button key={k} onClick={() => up("sexe")(k)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `2px solid ${f.sexe === k ? C.green : "#E1E6DC"}`, background: f.sexe === k ? C.greenPale : "#fff", fontWeight: 600, cursor: "pointer", color: C.ink }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1 }}><div style={S.miniMuted}>Âge</div><input type="number" style={inp} value={f.age ?? ""} onChange={(e) => up("age")(e.target.value)} /></div>
          <div style={{ flex: 1 }}><div style={S.miniMuted}>Taille (cm)</div><input type="number" style={inp} value={f.taille ?? ""} onChange={(e) => up("taille")(e.target.value)} /></div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1 }}><div style={S.miniMuted}>Poids (kg)</div><input type="number" style={inp} value={f.poids ?? ""} onChange={(e) => up("poids")(e.target.value)} /></div>
          <div style={{ flex: 1 }}><div style={S.miniMuted}>Objectif (kg)</div><input type="number" style={inp} value={f.objectif ?? ""} onChange={(e) => up("objectif")(e.target.value)} /></div>
        </div>

        <div style={{ ...S.sectionLabel, marginTop: 4 }}>Activité quotidienne (hors sport)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {Object.entries(NEAT).map(([k, v]) => (
            <button key={k} onClick={() => up("neat")(k)} style={{ ...S.radioRow, alignItems: "flex-start", ...((f.neat || "debout") === k ? S.radioOn : {}) }}>
              <span style={{ textAlign: "left" }}><span style={{ display: "block" }}>{v.label}</span><span style={{ ...S.miniMuted, fontSize: 11 }}>{v.desc}</span></span>
            </button>
          ))}
        </div>
        <div style={S.sectionLabel}>Fréquence de sport</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {Object.entries(SPORT_FREQ).map(([k, v]) => (
            <button key={k} onClick={() => up("sportFreq")(k)} style={{ ...S.radioRow, ...((f.sportFreq || "f1_2") === k ? S.radioOn : {}) }}>{v.label}</button>
          ))}
        </div>

        <div style={S.sectionLabel}>Motivation principale</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {Object.entries(MOTIVATION).map(([k, v]) => (
            <button key={k} onClick={() => up("motivation")(k)} style={{ ...S.radioRow, alignItems: "flex-start", ...((f.motivation || "perte") === k ? S.radioOn : {}) }}>
              <span style={{ textAlign: "left" }}><span style={{ display: "block" }}>{v.label}</span><span style={{ ...S.miniMuted, fontSize: 11 }}>{v.desc}</span></span>
            </button>
          ))}
        </div>

        <div style={S.sectionLabel}>Régime alimentaire</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {Object.entries(REGIME).map(([k, v]) => (
            <button key={k} onClick={() => up("regime")(k)} style={{ ...S.radioRow, alignItems: "flex-start", ...((f.regime || "omnivore") === k ? S.radioOn : {}) }}>
              <span style={{ textAlign: "left" }}><span style={{ display: "block" }}>{v.label}</span><span style={{ ...S.miniMuted, fontSize: 11 }}>{v.desc}</span></span>
            </button>
          ))}
        </div>

        <button onClick={save} style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: C.green, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>C'est parti</button>
        <button onClick={onDone} style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", marginTop: 14, display: "block", width: "100%" }}>Passer</button>
      </div>
    </div>
  );
}
/* Génère un JPEG stylé (canvas) résumant la semaine et le télécharge. */
function exportSemaineImage({ days, diary, sport, water, cible, waterGoal, weekLabel, weightDelta, avgKcal, inTarget, logged, sportKcal, waterAvg, fmtDay }) {
  const W = 1080, H = 1350;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const accent = "#235C86", ink = "#201E1D", bg = "#F3F2F2", divider = "rgba(32,30,29,.14)", muted = "rgba(32,30,29,.52)";
  const F = "'Archivo', system-ui, sans-serif";

  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = ink;
  ctx.font = `800 42px ${F}`;
  ctx.fillText("NutriSuivi", 60, 90);
  ctx.fillStyle = accent;
  ctx.font = `700 20px ${F}`;
  ctx.fillText("MA SEMAINE", 60, 140);
  ctx.fillRect(60, 156, 60, 4);
  ctx.fillStyle = ink;
  ctx.font = `800 36px ${F}`;
  ctx.fillText(weekLabel, 60, 220);
  ctx.fillStyle = muted;
  ctx.font = `500 20px ${F}`;
  ctx.fillText(`${fmtDay(days[0])} — ${fmtDay(days[6])}`, 60, 252);

  // Barres jours
  const barY = 330, barMaxH = 200, barW = (W - 200) / 7;
  const kcals = days.map((d) => sommeMacros(diary[d]).kcal);
  const maxKcal = Math.max(cible * 1.2, ...kcals, 1);
  ctx.fillStyle = accent; ctx.fillRect(60, barY + barMaxH + 40, 2, 200); // Y axis
  ctx.fillRect(60, barY + barMaxH + 40, W - 120, 2); // X axis line
  days.forEach((d, i) => {
    const k = kcals[i];
    const h = k > 0 ? Math.max(4, (k / maxKcal) * barMaxH) : 0;
    const x = 90 + i * barW;
    if (h > 0) {
      ctx.fillStyle = k <= cible ? accent : "#C0562B";
      ctx.fillRect(x, barY + barMaxH - h, barW - 12, h);
      ctx.fillStyle = ink;
      ctx.font = `700 14px ${F}`;
      ctx.textAlign = "center";
      ctx.fillText(String(Math.round(k)), x + (barW - 12) / 2, barY + barMaxH - h - 8);
      ctx.textAlign = "start";
    }
    ctx.fillStyle = muted;
    ctx.font = `600 12px ${F}`;
    ctx.textAlign = "center";
    ctx.fillText(fmtDay(d), x + (barW - 12) / 2, barY + barMaxH + 62);
    ctx.textAlign = "start";
  });
  // Ligne cible
  const cibleY = barY + barMaxH - (cible / maxKcal) * barMaxH;
  ctx.strokeStyle = accent; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(90, cibleY); ctx.lineTo(W - 60, cibleY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = accent;
  ctx.font = `700 13px ${F}`;
  ctx.fillText(`Cible ${cible}`, W - 200, cibleY - 6);

  // Stats block
  const statY = 720;
  const stats = [
    ["MOYENNE KCAL", avgKcal || "—", "/ jour"],
    ["JOURS SOUS CIBLE", `${inTarget}/${logged || 0}`, ""],
    ["DÉFICIT SPORT", `${sportKcal}`, "kcal"],
    ["HYDRATATION", waterAvg.toFixed(1).replace(".", ","), `verres/jour · cible ${waterGoal}`],
  ];
  const cellW = (W - 120) / 2, cellH = 150;
  stats.forEach((s, i) => {
    const row = Math.floor(i / 2), col = i % 2;
    const x = 60 + col * cellW, y = statY + row * cellH;
    ctx.strokeStyle = divider; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cellW - 20, cellH - 20);
    ctx.fillStyle = muted;
    ctx.font = `700 13px ${F}`;
    ctx.fillText(s[0], x + 24, y + 34);
    ctx.fillStyle = accent;
    ctx.font = `800 44px ${F}`;
    ctx.fillText(String(s[1]), x + 24, y + 90);
    if (s[2]) {
      ctx.fillStyle = muted;
      ctx.font = `500 13px ${F}`;
      ctx.fillText(s[2], x + 24, y + 116);
    }
  });

  // Poids
  const wY = statY + cellH * 2 + 30;
  ctx.fillStyle = muted;
  ctx.font = `700 13px ${F}`;
  ctx.fillText("TENDANCE DE POIDS (7 J)", 60, wY);
  if (weightDelta === null) {
    ctx.fillStyle = muted;
    ctx.font = `500 15px ${F}`;
    ctx.fillText("Pas assez de données", 60, wY + 40);
  } else {
    ctx.fillStyle = weightDelta <= 0 ? "#2C6E49" : "#C0562B";
    ctx.font = `800 56px ${F}`;
    ctx.fillText(`${weightDelta > 0 ? "+" : ""}${String(weightDelta).replace(".", ",")} kg`, 60, wY + 60);
  }

  ctx.fillStyle = muted;
  ctx.font = `500 13px ${F}`;
  ctx.fillText("Généré par NutriSuivi", 60, H - 40);

  cv.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `nutrisuivi-semaine-${days[0]}.jpg`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/jpeg", 0.92);
}

function WeeklyAI({ days, diary, sport, cible, cibleProt, cibleLipMin, weightDelta, lastWeekAI, setLastWeekAI }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const weekKey = days[0]; // clé = lundi de la semaine affichée
  const saved = lastWeekAI && lastWeekAI.week === weekKey ? lastWeekAI.text : null;

  async function generate() {
    setBusy(true); setErr("");
    try {
      const txt = await analyseWeekIA({ days, diary, sport, cible, cibleProt, cibleLipMin, weightDelta });
      if (!txt) throw new Error("Réponse vide");
      setLastWeekAI({ week: weekKey, text: txt, generatedAt: Date.now() });
    } catch (e) {
      setErr("L'analyse IA n'est pas disponible ici (pont serveur manquant en prod, ou pas de réseau). Elle fonctionnera dès que le pont Anthropic sera activé.");
    }
    setBusy(false);
  }

  return (
    <div style={{ ...S.cardFramed, borderColor: C.accent }}>
      <div style={{ ...S.kicker, color: C.accent }}>ANALYSE IA — TA SEMAINE</div>
      <div style={S.kickerTrait} />
      {saved ? (
        <>
          <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{saved}</div>
          <button onClick={generate} disabled={busy}
            style={{ marginTop: 14, padding: "10px 16px", border: `1px solid ${C.divider}`, background: "#fff", color: C.accent, cursor: busy ? "wait" : "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>
            {busy ? "Analyse en cours…" : "🔄 Regénérer"}
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
            Un mini bilan pédagogique de ta semaine par une IA nutritionniste : ce qui a marché, ce qui accroche, et une action simple pour la suite.
          </div>
          <button onClick={generate} disabled={busy}
            style={{ ...S.primaryBtn, marginTop: 0, opacity: busy ? 0.6 : 1 }}>
            {busy ? "Analyse en cours…" : "✨ Générer l'analyse de la semaine"}
          </button>
        </>
      )}
      {err && (
        <div style={{ ...S.miniMuted, fontSize: 12, marginTop: 10, color: C.negative, lineHeight: 1.5 }}>
          {err}
        </div>
      )}
    </div>
  );
}

function Semaine({ diary, sport, poidsLog, water, cible, cibleProt, cibleLipMin, waterGoal, lastWeekAI, setLastWeekAI }) {
  const [offset, setOffset] = useState(0); // 0 = semaine courante, -1 = semaine précédente, etc.
  const today = todayISO();
  const dow = (new Date(today).getDay() + 6) % 7;
  const monday = shiftDate(today, -dow + offset * 7);
  const days = Array.from({ length: 7 }, (_, i) => shiftDate(monday, i));
  const passed = days.filter((d) => d <= today);
  const logged = passed.filter((d) => (diary[d] || []).length > 0);
  const kcals = logged.map((d) => sommeMacros(diary[d]).kcal);
  const avgKcal = kcals.length ? Math.round(kcals.reduce((a, b) => a + b, 0) / kcals.length) : 0;
  const inTarget = logged.filter((d) => sommeMacros(diary[d]).kcal <= cible).length;
  const sportKcal = Math.round(days.reduce((a, d) => a + sommeSport(sport[d]), 0));
  const waterAvg = passed.length ? (passed.reduce((a, d) => a + (water[d] || 0), 0) / passed.length) : 0;

  const sortedLog = [...(poidsLog || [])].sort((a, b) => a.date.localeCompare(b.date));
  const weekEnd = days[6];
  let weightDelta = null;
  const weightsInWindow = sortedLog.filter((x) => x.date <= weekEnd);
  if (weightsInWindow.length >= 2) {
    const last = weightsInWindow[weightsInWindow.length - 1];
    const ref = [...weightsInWindow].reverse().find((x) => x.date <= shiftDate(last.date, -6)) || weightsInWindow[0];
    weightDelta = +(last.poids - ref.poids).toFixed(1);
  }

  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const fmtDay = (iso) => { const d = new Date(iso); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`; };
  const fmtRange = () => `${fmtDay(days[0])} — ${fmtDay(days[6])}`;
  const weekLabel = offset === 0 ? "Cette semaine"
    : offset === -1 ? "Semaine dernière"
    : offset < 0 ? `Il y a ${-offset} semaines`
    : offset === 1 ? "Semaine prochaine" : `Dans ${offset} semaines`;

  const Stat = ({ label, value, sub, color }) => (
    <div style={{ ...S.cardFramed, flex: 1, minWidth: 160 }}>
      <div style={{ ...S.sectionLabel, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 30, color: color || C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 6 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "24px 4px" }}>
      <div>
        <div style={S.kicker}>MA SEMAINE</div>
        <div style={S.kickerTrait} />
      </div>

      {/* Nav semaines */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${C.divider}`, borderBottom: `2px solid ${C.divider}`, padding: "12px 4px" }}>
        <button onClick={() => setOffset((o) => o - 1)} style={S.dateArrow} title="Semaine précédente">‹</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}>{weekLabel}</div>
          <div style={{ ...S.miniMuted, fontSize: 12, marginTop: 2 }}>{fmtRange()}</div>
        </div>
        <button onClick={() => setOffset((o) => Math.min(0, o + 1))}
          style={{ ...S.dateArrow, opacity: offset >= 0 ? 0.35 : 1, cursor: offset >= 0 ? "default" : "pointer" }}
          title="Semaine suivante" disabled={offset >= 0}>›</button>
      </div>

      {/* Jours suivis avec dates */}
      <div>
        <div style={{ ...S.sectionLabel, marginBottom: 12 }}>JOURS SUIVIS</div>
        <div style={{ display: "flex", gap: 6 }}>
          {days.map((d, i) => {
            const done = (diary[d] || []).length > 0;
            const future = d > today;
            const isTdy = d === today;
            return (
              <div key={d} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{jours[i]}</div>
                <div style={{ height: 44, background: future ? C.divider : done ? C.accent : "#F0D9CE", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 15, border: isTdy ? `2px solid ${C.accentDark}` : "none" }}>
                  {future ? "" : done ? "✓" : "–"}
                </div>
                <div style={{ fontSize: 11, color: isTdy ? C.accent : C.muted, marginTop: 6, fontWeight: isTdy ? 700 : 500 }}>{fmtDay(d)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="MOYENNE KCAL / JOUR" value={avgKcal || "—"} sub={`cible ${cible}`} color={avgKcal && avgKcal <= cible ? C.accent : C.negative} />
        <Stat label="JOURS DANS LA CIBLE" value={`${inTarget}/${logged.length || 0}`} sub="jours loggés sous la cible" color={C.accent} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="DÉFICIT SPORT" value={`${sportKcal} kcal`} sub={`≈ ${Math.round(sportKcal / 7.7)} g de gras`} color={C.accent} />
        <Stat label="HYDRATATION" value={`${waterAvg.toFixed(1).replace(".", ",")} / ${waterGoal}`} sub="verres/jour en moyenne" color={C.accent} />
      </div>

      <WeeklyAI days={days} diary={diary} sport={sport}
        cible={cible} cibleProt={cibleProt} cibleLipMin={cibleLipMin} weightDelta={weightDelta}
        lastWeekAI={lastWeekAI} setLastWeekAI={setLastWeekAI} />

      <button onClick={() => exportSemaineImage({ days, diary, sport, water, cible, waterGoal, weekLabel, weightDelta, avgKcal, inTarget, logged: logged.length, sportKcal, waterAvg, fmtDay })}
        style={{ ...S.addDayBtn, marginTop: 4 }}>
        ⬇ Partager cette semaine (image)
      </button>

      <div style={S.cardFramed}>
        <div style={{ ...S.sectionLabel, marginBottom: 8 }}>TENDANCE DE POIDS (7 JOURS)</div>
        {weightDelta === null ? (
          <div style={{ ...S.miniMuted, fontSize: 13, marginTop: 6 }}>Pèse-toi quelques jours pour voir ta tendance apparaître.</div>
        ) : (
          <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", color: weightDelta <= 0 ? C.positive : C.negative, lineHeight: 1 }}>
            {weightDelta > 0 ? "+" : ""}{weightDelta.toString().replace(".", ",")} kg
          </div>
        )}
        <div style={{ ...S.miniMuted, fontSize: 12, marginTop: 12, lineHeight: 1.55 }}>
          Rappel : la balance sur plusieurs semaines est le seul vrai juge. Un écart d'un jour ne veut rien dire — regarde la pente.
        </div>
      </div>
    </div>
  );
}
function Splash() {
  return <div style={{ ...S.app, alignItems: "center", justifyContent: "center", display: "flex" }}>
    <div style={{ color: C.green, fontWeight: 800, fontSize: 22 }}>NutriSuivi…</div></div>;
}

/* --------------------------- Style tokens -------------------------- */
/* Direction Modernist : plat, angles droits, filets nets, une seule couleur d'accent. */
const C = {
  bg: "#F3F2F2",
  card: "#FFFFFF",
  ink: "#201E1D",
  muted: "rgba(32,30,29,.52)",
  divider: "rgba(32,30,29,.14)",
  dividerStrong: "rgba(32,30,29,.22)",
  accent: "#235C86",
  accentDark: "#184863",
  accentTint: "#E4EDF3",
  navy: "#0D2740",
  navyText: "rgba(255,255,255,0.70)",
  positive: "#2C6E49",
  negative: "#C0562B",
  // Alias historiques — pointent vers la nouvelle palette pour ne rien casser
  green: "#235C86",       // ex-vert primaire → accent
  greenPale: "#E4EDF3",   // ex-vert pâle → tint
  amber: "#235C86",       // couleur secondaire → accent (une seule couleur d'accent)
  red: "#C0562B",
};

const S = {
  app: { maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.bg, color: C.ink,
    fontFamily: "'Archivo', system-ui, sans-serif", display: "flex", flexDirection: "column", position: "relative" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 18px 12px", position: "sticky", top: 0, zIndex: 5, background: C.navy },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "'Archivo', sans-serif", color: "#fff" },
  sub: { fontSize: 12, color: C.navyText, marginTop: 2 },
  main: { flex: 1, padding: "4px 14px 96px", overflowY: "auto" },
  // Cartes = surface blanche plate, aucun radius ni ombre
  card: { background: C.card, borderRadius: 0, padding: 18, border: "none" },
  cardFramed: { background: C.card, borderRadius: 0, padding: 18, border: `2px solid ${C.divider}` },
  nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480,
    display: "flex", justifyContent: "space-around", background: "#fff", borderTop: `1px solid ${C.divider}`, padding: "8px 0 10px", zIndex: 10 },
  navBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", color: C.muted, cursor: "pointer", padding: "4px 12px", fontFamily: "'Archivo', sans-serif" },
  navBtnOn: { color: C.accent, fontWeight: 700 },
  bigNum: { fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "'Archivo', sans-serif", lineHeight: 0.9, color: C.ink },
  miniMuted: { fontSize: 12, color: C.muted },
  kicker: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: C.accent },
  kickerTrait: { width: 44, height: 3, background: C.accent, marginTop: 8, marginBottom: 22 },
  sectionLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted, marginBottom: 10 },
  dateArrow: { background: "none", border: `1px solid ${C.divider}`, borderRadius: 0, fontSize: 20, color: C.accent, cursor: "pointer", width: 32, height: 32, display: "grid", placeItems: "center", padding: 0 },
  entryRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.divider}` },
  thumb: { width: 40, height: 40, borderRadius: 0, objectFit: "cover" },
  del: { background: "transparent", border: `1px solid ${C.divider}`, borderRadius: 0, width: 30, height: 30, fontSize: 16, color: C.muted, cursor: "pointer", flexShrink: 0, display: "grid", placeItems: "center", padding: 0 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 0, border: `1px solid ${C.divider}`, fontSize: 15, background: "#fff", boxSizing: "border-box", outline: "none", color: C.ink, fontFamily: "'Archivo', sans-serif" },
  chip: { padding: "9px 14px", borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", fontSize: 13, cursor: "pointer", color: C.ink, fontFamily: "'Archivo', sans-serif" },
  chipOn: { background: C.accent, color: "#fff", borderColor: C.accent, fontWeight: 700 },
  foodRow: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 6px", background: "none", border: "none", borderBottom: `1px solid ${C.divider}`, cursor: "pointer", fontFamily: "'Archivo', sans-serif" },
  dot: { width: 9, height: 9, borderRadius: 0, flexShrink: 0, background: C.accent },
  qBtn: { flex: 1, padding: "8px 0", borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", fontSize: 13, cursor: "pointer", color: C.ink, fontFamily: "'Archivo', sans-serif" },
  calcBox: { display: "flex", justifyContent: "space-between", alignItems: "center", background: C.accentTint, borderRadius: 0, padding: "12px 14px", marginTop: 12 },
  photoBtn: { flex: 1, padding: "11px 0", borderRadius: 0, border: `1px dashed ${C.dividerStrong}`, background: "#fff", fontSize: 14, cursor: "pointer", color: C.accent, fontWeight: 700 },
  primaryBtn: { width: "100%", marginTop: 14, padding: "14px 0", borderRadius: 0, border: "none", background: C.accent, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Archivo', sans-serif", letterSpacing: "0.02em" },
  linkBtn: { background: "none", border: "none", color: C.accent, fontSize: 13, cursor: "pointer", textDecoration: "none", fontWeight: 600, fontFamily: "'Archivo', sans-serif" },
  radioRow: { display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", cursor: "pointer", fontSize: 14, color: C.ink, fontFamily: "'Archivo', sans-serif" },
  radioOn: { borderColor: C.accent, background: C.accentTint, fontWeight: 700, color: C.accent },
  addDayBtn: { width: "100%", padding: "13px 0", borderRadius: 0, border: `2px solid ${C.accent}`, background: "#fff", color: C.accent, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Archivo', sans-serif", letterSpacing: "0.02em" },
  addSmall: { padding: "8px 14px", borderRadius: 0, border: "none", background: C.accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Archivo', sans-serif" },
  sportAddBtn: { padding: "8px 14px", borderRadius: 0, border: "none", background: C.accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  copyBtn: { width: "100%", padding: "10px 0", borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", color: C.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Archivo', sans-serif" },
  favBtn: { padding: "5px 10px", borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer" },
  badge: { fontSize: 10, background: C.accentTint, color: C.accent, padding: "2px 6px", borderRadius: 0, marginLeft: 6, fontWeight: 700, verticalAlign: "middle", letterSpacing: "0.06em", textTransform: "uppercase" },
  // calendrier — mobile
  calHead: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 },
  calHeadCell: { textAlign: "center", fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 0, border: `1px solid ${C.divider}` },
  calCell: { aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "#fff", border: `1px solid ${C.divider}`, borderRadius: 0, cursor: "pointer", color: C.ink, position: "relative", margin: -0.5, fontFamily: "'Archivo', sans-serif" },
  calCellSel: { background: C.accent, color: "#fff" },
  calCellToday: { outline: `2px solid ${C.accent}`, outlineOffset: "-2px" },
  calDot: { width: 4, height: 4, borderRadius: 0 },
  // sheet
  overlay: { position: "fixed", inset: 0, background: "rgba(20,18,17,.42)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  sheet: { width: "100%", maxWidth: 520, background: "#fff", borderRadius: 0, border: `2px solid ${C.ink}`, padding: "18px 22px 26px", maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box" },
  sheetGrab: { width: 40, height: 3, background: C.divider, margin: "0 auto 14px" },
  // graphique
  tabPill: { flex: 1, padding: "11px 0", borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", fontSize: 13, fontWeight: 700, color: C.ink, cursor: "pointer", fontFamily: "'Archivo', sans-serif", letterSpacing: "0.02em" },
  tabPillOn: { background: C.accent, color: "#fff", borderColor: C.accent },
  miniTab: { padding: "8px 14px", borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", fontSize: 13, cursor: "pointer", color: C.ink, fontFamily: "'Archivo', sans-serif", fontWeight: 600 },
  miniTabOn: { background: C.accent, color: "#fff", borderColor: C.accent, fontWeight: 700 },
  zoomBtn: { width: 32, height: 32, borderRadius: 0, border: `1px solid ${C.divider}`, background: "#fff", fontSize: 18, cursor: "pointer", color: C.accent, fontWeight: 700, display: "grid", placeItems: "center", padding: 0 },
  tooltip: { borderRadius: 0, border: `1px solid ${C.divider}`, boxShadow: "none", fontSize: 13, background: "#fff", fontFamily: "'Archivo', sans-serif" },
};

/* Aliases pour compat MEAL_COLORS — utilisés uniquement dans le calendrier (pastilles) */
// La direction Modernist abandonne les couleurs de repas : on remplace par l'accent partout.

function StyleInject() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
      * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      html, body { margin: 0; background: ${C.bg}; color: ${C.ink}; font-family: 'Archivo', system-ui, sans-serif; }
      ::selection { background: ${C.accentTint}; color: ${C.ink}; }
      input[type=range] { height: 24px; accent-color: ${C.accent}; }
      button, input, select, textarea { font-family: 'Archivo', system-ui, sans-serif; }
      button:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
      a { color: ${C.accent}; }
      a:hover { color: ${C.accentDark}; }
      ::-webkit-scrollbar { width: 0; height: 0; }
    `}</style>
  );
}
