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
function creditedKcal(date, sportAll, partSport, mode) {
  const frac = (partSport ?? 60) / 100;
  if (mode === "reparti") {
    let s = 0;
    for (let i = 0; i < 7; i++) s += sommeSport(sportAll[shiftDate(date, -i)]);
    return Math.round((s * frac) / 7);
  }
  return Math.round(sommeSport(sportAll[date]) * frac);
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
const VERSION = "1.7";
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
    poids: 86, taille: 183, age: 35, sexe: "homme", neat: "debout", sportFreq: "f1_2", deficit: 500, objectif: 80, crediterSport: false, partSport: 60, sportMode: "jour", rappelRepas: { on: true, h: 21, m: 30 }, waterGoal: 8,
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

  const allSports = useMemo(() => [...SPORTS, ...customSports], [customSports]);

  const catalog = useMemo(() => [...FOODS, ...customFoods], [customFoods]);

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
      setLoaded(true);
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
    };
    setCustomFoods((cf) => [...cf, food]);
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

  return (
    <div style={{ minHeight: "100vh", background: isDesktop ? "#E7EBE2" : C.bg, color: C.ink, fontFamily: "'Inter',system-ui,sans-serif" }}>
      <StyleInject />
      <div style={isDesktop
        ? { maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, padding: 24, minHeight: "100vh", boxSizing: "border-box", alignItems: "start" }
        : {}}>
        {isDesktop && (
          <aside style={{ position: "sticky", top: 24, background: C.card, border: "2px solid #E0E6DA", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 6, minHeight: "calc(100vh - 48px)", boxSizing: "border-box" }}>
            <div style={{ marginBottom: 18 }}>
              <div style={S.logo}>Nutri<span style={{ color: C.amber }}>Suivi</span></div>
              <div style={S.sub}>Objectif {profil.objectif} kg · {cible} kcal/j</div>
            </div>
            {[["agenda", "Agenda", "▦"], ["semaine", "Semaine", "▥"], ["liste", "Liste", "☰"], ["graphique", "Graphique", "▤"], ["profil", "Profil", "◇"]].map(([id, label, ic]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === id ? C.greenPale : "transparent", color: tab === id ? C.green : C.ink, fontWeight: tab === id ? 700 : 500, fontSize: 15, textAlign: "left" }}>
                <span style={{ fontSize: 18, width: 20, textAlign: "center" }}>{ic}</span>{label}
              </button>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", justifyContent: "center" }}>
              <RingSmall value={sommeMacros(diary[todayISO()]).kcal}
                max={cible + (profil.crediterSport ? creditedKcal(todayISO(), sport, profil.partSport ?? 60, profil.sportMode ?? "jour") : 0)} />
            </div>
          </aside>
        )}

        <div style={{ minWidth: 0, maxWidth: isDesktop ? "none" : 480, margin: isDesktop ? 0 : "0 auto", width: "100%" }}>
          {!isDesktop && (
            <header style={S.header}>
              <div>
                <div style={S.logo}>Nutri<span style={{ color: C.amber }}>Suivi</span></div>
                <div style={S.sub}>Objectif {profil.objectif} kg · {cible} kcal/jour</div>
              </div>
              <RingSmall value={sommeMacros(diary[todayISO()]).kcal}
                max={cible + (profil.crediterSport ? creditedKcal(todayISO(), sport, profil.partSport ?? 60, profil.sportMode ?? "jour") : 0)} />
            </header>
          )}

          <main style={{ ...S.main, padding: isDesktop ? "0 0 24px" : "4px 14px 96px" }}>
        {tab === "agenda" && (
          <Agenda diary={diary} dateSel={dateSel} setDateSel={setDateSel}
            tot={totJour} cible={cible} cibleProt={cibleProt} cibleGluc={cibleGluc} cibleLipMin={cibleLipMin}
            onDel={delEntry} onAdd={(rid) => { if (rid) setAddRepas(rid); setAddOpen(true); }}
            mealPhotos={mealPhotos} onMealPhoto={setMealPhoto} onClearMealPhoto={clearMealPhoto}
            sportAll={sport} sportEntries={sport[dateSel] || []} onAddSport={() => setSportOpen(true)}
            onDelSport={delSport} crediterSport={profil.crediterSport} partSport={profil.partSport ?? 60}
            sportMode={profil.sportMode ?? "jour"} onEditEntry={setEditData}
            onSaveFavorite={saveFavorite} onDuplicatePrev={duplicatePrevDay} isDesktop={isDesktop}
            water={water[dateSel] || 0} waterGoal={profil.waterGoal ?? 8} onAddWater={addWater} />
        )}
        {tab === "semaine" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Semaine diary={diary} sport={sport} poidsLog={poidsLog} water={water}
              cible={cible} waterGoal={profil.waterGoal ?? 8} />
          </div>
        )}
        {tab === "liste" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Liste catalog={catalog} customFoods={customFoods} setCustomFoods={setCustomFoods}
              customSports={customSports} setCustomSports={setCustomSports} poids={profil.poids}
              favMeals={favMeals} onDeleteFavorite={deleteFavorite} onRenameFavorite={renameFavorite}
              onUpdateFavorite={updateFavorite} />
          </div>
        )}
        {tab === "graphique" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Graphique diary={diary} cible={cible} poidsLog={poidsLog} objectif={profil.objectif} sport={sport}
              maintenance={maintenance} crediterSport={profil.crediterSport} partSport={profil.partSport ?? 60} />
          </div>
        )}
        {tab === "profil" && (
          <div style={{ maxWidth: isDesktop ? 760 : "none", margin: "0 auto" }}>
            <Profil profil={profil} setProfil={setProfil} bmr={bmr} maintenance={maintenance}
              cible={cible} cibleProt={cibleProt} poidsLog={poidsLog} setPoidsLog={setPoidsLog}
              onExport={exportData} onExportCSV={exportCSV} onImport={importData} onReset={resetAll}
              onReplayTutorial={() => setShowOnboarding(true)} />
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
function Agenda({ diary, dateSel, setDateSel, tot, cible, cibleProt, cibleGluc, cibleLipMin, onDel, onAdd, mealPhotos, onMealPhoto, onClearMealPhoto, sportAll, sportEntries, onAddSport, onDelSport, crediterSport, partSport, sportMode, onEditEntry, onSaveFavorite, onDuplicatePrev, isDesktop, water, waterGoal, onAddWater }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(dateSel); return { y: d.getFullYear(), m: d.getMonth() }; });
  const sportKcal = sommeSport(sportEntries);
  const credited = crediterSport ? creditedKcal(dateSel, sportAll, partSport, sportMode) : 0;
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

  return (
    <div style={isDesktop
      ? { display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }
      : { display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Calendrier */}
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
            if (!cell) return <div key={i} />;
            const items = diary[cell] || [];
            const mealsPresent = REPAS.filter((r) => items.some((e) => e.repas === r.id));
            const hasSport = ((sportAll[cell]) || []).length > 0;
            const sel = cell === dateSel;
            const tdy = cell === todayISO();
            return (
              <button key={i} onClick={() => setDateSel(cell)}
                style={{ ...S.calCell, ...(sel ? S.calCellSel : {}), ...(tdy && !sel ? S.calCellToday : {}) }}>
                <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500 }}>{Number(cell.slice(-2))}</span>
                <span style={{ display: "flex", gap: 2, minHeight: 5, alignItems: "center", justifyContent: "center", flexWrap: "wrap", maxWidth: 34 }}>
                  {mealsPresent.map((r) => <span key={r.id} style={{ ...S.calDot, background: MEAL_COLORS[r.id] }} />)}
                  {hasSport && <span style={{ ...S.calDot, background: SPORT_COLOR }} />}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Legend couleur={MEAL_COLORS.petitdej} txt="Déjeuner" />
          <Legend couleur={MEAL_COLORS.collation} txt="Collation" />
          <Legend couleur={MEAL_COLORS.midi} txt="Dîner" />
          <Legend couleur={MEAL_COLORS.soir} txt="Souper" />
          <Legend couleur={SPORT_COLOR} txt="Sport" />
        </div>
      </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Jour sélectionné */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>
          {isToday ? "Aujourd'hui" : jolieDate(dateSel)}
          {!isToday && <span style={S.miniMuted}> · {jolieDate(dateSel)}</span>}
        </div>
        {!isToday && <button style={S.linkBtn} onClick={() => setDateSel(todayISO())}>revenir à aujourd'hui</button>}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div><div style={S.bigNum}>{Math.round(tot.kcal)}</div><div style={S.miniMuted}>/ {cibleJour} kcal autorisées</div></div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...S.bigNum, color: reste >= 0 ? C.green : C.red }}>{reste >= 0 ? reste : `+${-reste}`}</div>
            <div style={S.miniMuted}>{reste >= 0 ? "restantes" : "au-dessus"}</div>
          </div>
        </div>
        <Barre value={tot.kcal} max={cibleJour} couleur={reste >= 0 ? C.green : C.red} />
        {crediterSport && credited > 0 && (
          <div style={{ ...S.miniMuted, marginTop: 6 }}>
            {sportMode === "reparti"
              ? `+${credited} kcal/jour lissés sur 7 jours — autorisé du jour : ${cibleJour}.`
              : `+${credited} kcal crédités (${partSport ?? 60} % de ${Math.round(sportKcal)} dépensées) — autorisé du jour : ${cibleJour}.`}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <MacroPill label="Protéines" v={tot.p} cible={cibleProt} unit="g" couleur="#C0562B" />
          <MacroPill label="Glucides" v={tot.c} cible={cibleGluc} unit="g" couleur="#E0912F" />
          <MacroPill label="Lipides" v={tot.f} min={cibleLipMin} unit="g" couleur="#6B8F71" />
        </div>
        {(tot.fib > 0 || tot.suc > 0) && (
          <div style={{ ...S.miniMuted, fontSize: 12, marginTop: 8, display: "flex", gap: 16 }}>
            <span>Fibres <b style={{ color: "#5B8A72" }}>{Math.round(tot.fib)} g</b></span>
            <span>Sucres <b style={{ color: "#C0398C" }}>{Math.round(tot.suc)} g</b></span>
          </div>
        )}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>💧 Hydratation</div>
            <div style={S.miniMuted}>{water} / {waterGoal} verres · {(water * 0.25).toFixed(2).replace(".", ",")} L</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => onAddWater(-1)} style={{ width: 36, height: 36, borderRadius: 11, border: "1px solid #CFE0E3", background: "#fff", color: "#2C7A86", fontSize: 20, cursor: "pointer" }}>−</button>
            <button onClick={() => onAddWater(1)} style={{ width: 36, height: 36, borderRadius: 11, border: "none", background: "#3E9CA8", color: "#fff", fontSize: 20, cursor: "pointer" }}>+</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
          {Array.from({ length: Math.max(waterGoal, water) }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < water ? "#3E9CA8" : "#E1EAEB" }} />
          ))}
        </div>
      </div>

      <button style={{ ...S.addDayBtn, background: "#3E9CA8" }} onClick={onAddSport}>＋ Ajouter sport</button>
      <button style={S.copyBtn} onClick={onDuplicatePrev}>⧉ Copier les repas de la veille</button>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sportEntries.length ? 8 : 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 11, height: 11, borderRadius: 6, background: SPORT_COLOR, flexShrink: 0 }} />
            <span style={{ fontWeight: 700 }}>Sport</span>
            {sportKcal > 0 && <span style={S.miniMuted}> · {Math.round(sportKcal)} kcal ce jour</span>}
          </div>
          <span style={{ ...S.miniMuted, fontWeight: 700, color: "#3E9CA8" }}>Semaine : {weekSport} kcal</span>
        </div>
        {sportEntries.map((e) => (
          <div key={e.id} style={S.entryRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.nom}</div>
              <div style={S.miniMuted}>{e.minutes} min · {Math.round(e.kcal)} kcal</div>
            </div>
            <button style={S.del} onClick={() => onDelSport(e.id)}>×</button>
          </div>
        ))}
        {!sportEntries.length && <div style={{ ...S.miniMuted, fontSize: 13 }}>Aucune activité ce jour.</div>}
      </div>

      <div style={{ ...S.card, background: "#EAF5F6" }}>
        <div style={{ fontWeight: 700, color: "#2C7A86" }}>Ta semaine sport</div>
        <div style={{ ...S.miniMuted, marginTop: 8, lineHeight: 1.5 }}>
          Ton sport a creusé <b style={{ color: "#2C7A86" }}>{motivation.kcal} kcal</b> de déficit cette semaine, soit ≈ <b>{motivation.gFat} g de gras</b>. Ta récompense, c'est ça : des résultats plus rapides et ton muscle préservé — pas une assiette en plus.
        </div>
      </div>

      {parRepas.map((r) => (
        <div key={r.id} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: r.items.length ? 8 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 11, height: 11, borderRadius: 6, background: MEAL_COLORS[r.id], flexShrink: 0 }} />
              <span style={{ fontWeight: 700 }}>{r.label}</span><span style={S.miniMuted}> · {r.h}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {r.items.length > 0 && <button style={S.favBtn} onClick={() => onSaveFavorite(r.id)}>★ Enregistrer</button>}
              <span style={{ ...S.miniMuted, fontWeight: 700 }}>{Math.round(sommeMacros(r.items).kcal)} kcal</span>
              <MealPhoto compact photo={(mealPhotos[dateSel] || {})[r.id]}
                onSet={(u) => onMealPhoto(dateSel, r.id, u)} onClear={() => onClearMealPhoto(dateSel, r.id)} />
            </div>
          </div>
          {r.items.map((e) => (
            <div key={e.id} style={S.entryRow}>
              {e.photo && <img src={e.photo} alt="" style={S.thumb} />}
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => onEditEntry(e)}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.nom}</div>
                <div style={S.miniMuted}>{e.grams} g · {Math.round(e.kcal)} kcal · <span style={{ color: C.green }}>modifier</span></div>
              </div>
              <button style={S.del} onClick={() => onDel(e.id)}>×</button>
            </div>
          ))}
          <button onClick={() => onAdd(r.id)}
            style={{ width: "100%", marginTop: 10, padding: "11px 0", borderRadius: 12, border: "none", background: MEAL_COLORS[r.id], color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            ＋ Ajouter à {r.label}
          </button>
        </div>
      ))}
      </div>
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
  return { nom, kcal: kcal != null ? Math.round(kcal) : "", p: num(n.proteins_100g), c: num(n.carbohydrates_100g), f: num(n.fat_100g), grp: "plat" };
}

function Scanner({ onClose, onResult }) {
  const videoRef = useRef();
  const streamRef = useRef();
  const [status, setStatus] = useState("init"); // init, scanning, nocam, nodetector, loading, notfound, error
  const [manual, setManual] = useState("");
  const [msg, setMsg] = useState("");
  const [detail, setDetail] = useState("");

  function stopCam() { try { streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop()); } catch {} }

  async function lookup(code) {
    stopCam(); setStatus("loading"); setMsg(`Recherche du code ${code}…`);
    try {
      const prod = await fetchOFF(code);
      if (prod) onResult(prod);
      else { setStatus("notfound"); setMsg(`Produit ${code} introuvable dans Open Food Facts. Encode-le à la main — il sera sauvegardé dans ta liste pour toujours.`); }
    } catch { setStatus("error"); setMsg("Connexion à Open Food Facts impossible. Vérifie ta connexion, ou encode les valeurs à la main."); }
  }

  useEffect(() => {
    let active = true, raf;
    (async () => {
      if (typeof window === "undefined") { setStatus("nodetector"); return; }
      if (!("BarcodeDetector" in window)) {
        setStatus("nodetector");
        setDetail("Ton navigateur ne peut pas lire directement les codes-barres (fréquent sur iPhone et sur PC). Utilise le champ ci-dessous : tape le code (13 chiffres au dos du produit) et c'est fait.");
        return;
      }
      let detector;
      try { detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }); }
      catch { setStatus("nodetector"); setDetail("Le lecteur de codes-barres n'a pas pu démarrer. Utilise le code manuel ci-dessous."); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("nocam"); setDetail("Aucune caméra détectée. Utilise le code manuel ci-dessous."); return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; try { await videoRef.current.play(); } catch {} }
        setStatus("scanning");
        const tick = async () => {
          if (!active) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length) { lookup(codes[0].rawValue); return; }
          } catch {}
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch (e) {
        setStatus("nocam");
        setDetail(e && e.name === "NotAllowedError"
          ? "Tu n'as pas autorisé l'accès à la caméra. Autorise-le dans les réglages du navigateur, ou utilise le code manuel ci-dessous."
          : "La caméra n'est pas accessible (déjà utilisée par une autre app, ou bloquée). Utilise le code manuel ci-dessous.");
      }
    })();
    return () => { active = false; if (raf) cancelAnimationFrame(raf); stopCam(); };
  }, []);

  return (
    <div style={S.overlay} onClick={() => { stopCam(); onClose(); }}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={S.sheetGrab} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>📷 Scanner un produit</div>
          <button style={S.del} onClick={() => { stopCam(); onClose(); }}>×</button>
        </div>

        <div style={{ ...S.miniMuted, background: "#EAF1EB", borderRadius: 10, padding: "8px 10px", marginBottom: 12, lineHeight: 1.5, fontSize: 12 }}>
          Une fois trouvé, le produit est <b>sauvegardé pour toujours</b> dans ta liste — tu ne rescannes plus.
        </div>

        {status === "scanning" && (
          <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "#000", marginBottom: 10 }}>
            <video ref={videoRef} playsInline muted autoPlay style={{ width: "100%", display: "block", maxHeight: 280, objectFit: "cover", background: "#000" }} />
            <div style={{ position: "absolute", inset: "32% 12%", border: "2px solid rgba(255,255,255,.85)", borderRadius: 10 }} />
            <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 11, textShadow: "0 1px 2px rgba(0,0,0,.6)" }}>
              Vise le code-barres · si l'image reste noire, ta caméra est peut-être couverte
            </div>
          </div>
        )}
        {status === "init" && <div style={{ ...S.miniMuted, textAlign: "center", padding: 12 }}>Initialisation de la caméra…</div>}
        {status === "loading" && <div style={{ ...S.miniMuted, textAlign: "center", padding: 12 }}>{msg}</div>}
        {(status === "nocam" || status === "nodetector") && (
          <div style={{ background: "#FCF3E6", borderRadius: 10, padding: "10px 12px", marginBottom: 10, fontSize: 13, lineHeight: 1.5, color: "#7A5A18" }}>
            <b>{status === "nodetector" ? "Lecture caméra indisponible" : "Caméra bloquée"}</b><br />
            {detail}
          </div>
        )}
        {(status === "notfound" || status === "error") && (
          <div style={{ ...S.miniMuted, textAlign: "center", padding: 12, color: C.red }}>{msg}</div>
        )}

        <div style={{ marginTop: 4 }}>
          <div style={S.sectionLabel}>Ou entre le code-barres à la main</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...S.input, flex: 1 }} inputMode="numeric" placeholder="ex : 5410228123456"
              value={manual} onChange={(e) => setManual(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && manual.trim() && lookup(manual.trim())} />
            <button style={{ ...S.primaryBtn, marginTop: 0, width: "auto", padding: "12px 16px" }}
              onClick={() => manual.trim() && lookup(manual.trim())}>Chercher</button>
          </div>
          <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
            Données Open Food Facts (base collaborative, produits belges inclus). Le résultat pré-remplit la fiche que tu valides.
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
  const fileRef = useRef();

  function startCreate() { setNf({ nom: q, grp: "proteine" }); setCreating(true); }
  function saveNew() {
    if (!nf.nom || !nf.kcal) return;
    const food = onCreateFood(nf);
    setSel(food); setQ(food.nom); setCreating(false);
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
              <button key={f.id} onClick={() => { setSel(f); setQ(f.nom); }} style={S.foodRow}>
                <span style={{ ...S.dot, background: GROUPES[f.grp].couleur }} />
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span style={{ fontSize: 14, display: "block" }}>{f.nom}</span>
                  {PORT[f.id] && <span style={{ ...S.miniMuted, fontSize: 11 }}>{PORT[f.id][0].l} ≈ {PORT[f.id][0].g} g</span>}
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

  const liste = sports.filter((s) => norm(s.nom).includes(norm(q)));
  const kcalH = sel ? (sel.kcalH != null ? sel.kcalH : kcalPerH(sel.met, poids)) : 0;
  const kcal = Math.round((kcalH * min) / 60);

  function valider() {
    if (!sel) return;
    onAdd({ id: uid(), sportId: sel.id, nom: sel.nom, minutes: Number(min), kcal });
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
            </div>
            <button style={{ ...S.primaryBtn, background: "#3E9CA8" }} onClick={valider}>Enregistrer l'activité</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================= LISTE ============================= */
function Liste({ catalog, customFoods, setCustomFoods, customSports, setCustomSports, poids, favMeals, onDeleteFavorite, onRenameFavorite, onUpdateFavorite }) {
  const [view, setView] = useState("aliments");
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null);
  const [sportForm, setSportForm] = useState(null);
  const [scanOpen, setScanOpen] = useState(false);

  const filtered = catalog.filter((f) => norm(f.nom).includes(norm(q)));
  const parGroupe = GRP_ORDER.map((g) => ({ g, items: filtered.filter((f) => f.grp === g) })).filter((x) => x.items.length);
  const sports = [...SPORTS, ...customSports];

  function ajouter() {
    if (!form || !form.nom || !form.kcal) return;
    setCustomFoods((cf) => [...cf, {
      id: "u_" + uid(), nom: form.nom, grp: form.grp || "extra",
      kcal: Number(form.kcal), p: Number(form.p) || 0, c: Number(form.c) || 0, f: Number(form.f) || 0,
      fib: Number(form.fib) || 0, suc: Number(form.suc) || 0,
    }]);
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
        {[["aliments", "Aliments"], ["recettes", "Recettes"], ["sport", "Sport"], ["favoris", "Favoris"]].map(([k, l]) => (
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

          {parGroupe.map(({ g, items }) => (
            <div key={g} style={S.card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ ...S.dot, background: GROUPES[g].couleur }} />
                <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, color: C.muted }}>
                  {GROUPES[g].label}
                </span>
              </div>
              {items.map((f) => (
                <div key={f.id} style={S.entryRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {f.nom}{f.id.startsWith("u_") && <span style={S.badge}>perso</span>}
                    </div>
                    <div style={S.miniMuted}>{f.kcal} kcal · P{f.p} G{f.c} L{f.f} /100g</div>
                  </div>
                  {f.id.startsWith("u_") && <button style={S.del} onClick={() => supprimer(f.id)}>×</button>}
                </div>
              ))}
            </div>
          ))}
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
function Graphique({ diary, cible, poidsLog, objectif, sport, maintenance, crediterSport, partSport }) {
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
    if (metric === "net") return gran === "semaine" ? netWeekly(diary, sport, span) : netMonthly(diary, sport, span);
    return gran === "semaine" ? kcalWeekly(diary, span) : kcalMonthly(diary, span);
  }, [metric, gran, span, diary, sport, poidsLog]);

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

  const Row = ({ l, r, strong, color }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 14 }}>
      <span style={{ color: C.muted }}>{l}</span>
      <span style={{ fontWeight: strong ? 800 : 600, color: color || C.ink }}>{r}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={S.card}>
        <div style={S.sectionLabel}>Bilan des 7 derniers jours</div>
        {bilan.days === 0 ? (
          <div style={{ ...S.miniMuted, fontSize: 13 }}>Encore aucun repas cette semaine.</div>
        ) : (
          <>
            <Row l="Moyenne mangée / jour" r={`${bilan.avgIntake} kcal`} />
            <Row l="Sport / jour (moy.)" r={`${bilan.avgSport} kcal`} />
            <Row l="Déficit estimé / jour" r={`${bilan.deficit >= 0 ? "−" : "+"}${Math.abs(bilan.deficit)} kcal`} strong
              color={bilan.deficit >= 0 ? C.green : C.red} />
            <Row l="Projection" r={`${bilan.kgWeek > 0 ? "+" : ""}${bilan.kgWeek.toFixed(2)} kg/sem`} strong
              color={bilan.kgWeek <= 0 ? C.green : C.red} />
            {poidsTrend && (
              <Row l={`Réel — balance (${poidsTrend.span} j)`}
                r={`${poidsTrend.perWeek > 0 ? "+" : ""}${poidsTrend.perWeek.toFixed(2)} kg/sem`}
                color={poidsTrend.perWeek <= 0 ? C.green : C.red} />
            )}
            <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 8 }}>
              La projection est une estimation. Si elle s'écarte du réel de la balance sur 2-3 semaines, ajuste de 100-200 kcal.
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, padding: "0 4px" }}>
        {[["calories", "Calories"], ["net", "Net"], ["poids", "Poids"], ["sport", "Sport"]].map(([k, l]) => (
          <button key={k} onClick={() => { setMetric(k); setZoom(0); }} style={{ ...S.tabPill, fontSize: 13, padding: "10px 0", ...(metric === k ? S.tabPillOn : {}) }}>{l}</button>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[["semaine", "Par semaine"], ["mois", "Par mois"]].map(([k, l]) => (
              <button key={k} onClick={() => { setGran(k); setZoom(0); }}
                style={{ ...S.miniTab, ...(gran === k ? S.miniTabOn : {}) }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button style={S.zoomBtn} onClick={() => setZoom((z) => Math.min(FEN.length - 1, z + 1))}>−</button>
            <span style={{ ...S.miniMuted, minWidth: 54, textAlign: "center" }}>
              {gran === "semaine" ? `${span} sem` : `${span} mois`}
            </span>
            <button style={S.zoomBtn} onClick={() => setZoom((z) => Math.max(0, z - 1))}>＋</button>
          </div>
        </div>

        <div style={{ ...S.miniMuted, marginBottom: 6 }}>
          {metric === "calories"
            ? `Moyenne ${moy || 0} kcal · cible ${cible}`
            : metric === "net"
            ? `Mangé − dépensé · cible ${cible}`
            : metric === "sport"
            ? `Déficit creusé par le sport · total ${sportTotal} kcal ≈ ${Math.round(sportTotal / 7.7)} g de gras`
            : `Objectif ${objectif} kg`}
        </div>

        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            {metric === "poids" ? (
              <LineChart data={data} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6EAE2" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} interval={xInterval} angle={xAngle} textAnchor={xAngle ? "end" : "middle"} height={xHeight} />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} kg`, ""]} contentStyle={S.tooltip} />
                <ReferenceLine y={refLine} stroke={C.amber} strokeDasharray="5 4" strokeWidth={2} />
                <Line type="monotone" dataKey="v" stroke={C.green} strokeWidth={3} dot={{ r: 3, fill: C.green }} activeDot={{ r: 6 }} />
                {gran === "semaine" && <Line type="monotone" dataKey="ma" stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" dot={false} />}
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6EAE2" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} interval={xInterval} angle={xAngle} textAnchor={xAngle ? "end" : "middle"} height={xHeight} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} kcal`, ""]} contentStyle={S.tooltip} />
                {metric !== "sport" && <ReferenceLine y={refLine} stroke={C.amber} strokeDasharray="5 4" strokeWidth={2} />}
                <Bar dataKey="v" radius={[5, 5, 0, 0]}>
                  {data.map((d, i) => <Cell key={i} fill={metric === "sport" ? "#3E9CA8" : (d.v === 0 ? "#DDE3DA" : d.v <= cible ? C.green : C.red)} />)}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {metric === "poids" && gran === "semaine" && (
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <Legend couleur={C.green} txt="Poids" />
            <Legend couleur={C.amber} txt="Moyenne 7 j" dash />
          </div>
        )}
        {(metric === "calories" || metric === "net") && (
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <Legend couleur={C.green} txt={gran === "semaine" ? "Sous la cible" : "Moy. sous cible"} />
            <Legend couleur={C.red} txt="Au-dessus" />
            <Legend couleur={C.amber} txt="Cible" dash />
          </div>
        )}
        {metric === "sport" && (
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <Legend couleur="#3E9CA8" txt={gran === "semaine" ? "Déficit sport / semaine" : "Déficit sport / mois"} />
          </div>
        )}
      </div>

      <div style={{ ...S.miniMuted, textAlign: "center", fontSize: 12, padding: "0 20px" }}>
        {metric === "sport"
          ? (gran === "semaine" ? "Chaque barre = calories brûlées en sport dans la semaine." : "Chaque barre = calories brûlées en sport dans le mois.")
          : (gran === "mois" ? "Chaque barre = moyenne des kcal/jour du mois." : "Chaque barre = total du jour.")}
        {" "}Utilise − / ＋ pour zoomer.
      </div>
    </div>
  );
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
function netWeekly(diary, sport, weeks) {
  const dow = (new Date(todayISO()).getDay() + 6) % 7;
  const startMonday = shiftDate(todayISO(), -dow - (weeks - 1) * 7);
  const arr = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = shiftDate(startMonday, i);
    const dt = new Date(d);
    const wd = joursCourt[dt.getDay()];
    const cons = Math.round(sommeMacros(diary[d]).kcal);
    const burn = Math.round(sommeSport(sport[d]));
    arr.push({
      label: i === 0 ? `${wd} ${dt.getDate()}/${dt.getMonth() + 1}` : wd,
      v: cons === 0 ? 0 : cons - burn, date: d,
    });
  }
  return arr;
}
function netMonthly(diary, sport, spanMonths) {
  const now = new Date();
  const buckets = [];
  for (let i = spanMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ y: d.getFullYear(), m: d.getMonth(), total: 0, days: 0 });
  }
  Object.entries(diary).forEach(([date, entries]) => {
    const cons = sommeMacros(entries).kcal;
    if (cons <= 0) return;
    const dt = new Date(date);
    const b = buckets.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth());
    if (b) { b.total += cons - sommeSport(sport[date]); b.days += 1; }
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
function Profil({ profil, setProfil, bmr, maintenance, cible, cibleProt, poidsLog, setPoidsLog, onExport, onExportCSV, onImport, onReset, onReplayTutorial }) {
  const [nouveau, setNouveau] = useState(profil.poids);
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
  const dernier = poidsLog[poidsLog.length - 1];
  const depart = poidsLog[0];
  const perdu = depart && dernier ? (depart.poids - dernier.poids).toFixed(1) : 0;

  function toggleCredit() {
    setProfil((p) => ({ ...p, crediterSport: !p.crediterSport }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...S.card, background: C.ink, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Ta cible quotidienne</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{cible} <span style={{ fontSize: 16, fontWeight: 500 }}>kcal</span></div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85, lineHeight: 1.8 }}>
            <div>Métabolisme : {bmr}</div><div>Maintenance : {maintenance}</div><div>Protéines/j : {cibleProt} g</div>
          </div>
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>Calcul Mifflin-St Jeor — formule clinique.</div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}>Mon poids aujourd'hui</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="number" step="0.1" value={nouveau} onChange={(e) => setNouveau(e.target.value)} style={{ ...S.input, flex: 1 }} />
          <span style={{ fontWeight: 700 }}>kg</span>
          <button style={{ ...S.primaryBtn, margin: 0, width: "auto", padding: "12px 16px" }} onClick={enregistrerPoids}>Enregistrer</button>
        </div>
        {depart && (
          <div style={{ ...S.miniMuted, marginTop: 10 }}>
            Depuis le début : <b style={{ color: perdu > 0 ? C.green : C.ink }}>{perdu > 0 ? `−${perdu}` : perdu} kg</b> · départ {depart.poids} kg
          </div>
        )}
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
        <div style={S.sectionLabel}>Activité quotidienne (hors sport)</div>
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
        <div style={S.sectionLabel}>Fréquence de sport</div>
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
        <div style={S.sectionLabel}>Rythme de perte : −{profil.deficit} kcal/jour</div>
        <input type="range" min="250" max="750" step="50" value={profil.deficit}
          onChange={(e) => set("deficit")(Number(e.target.value))} style={{ width: "100%", accentColor: C.green }} />
        <div style={{ ...S.miniMuted, marginTop: 4 }}>≈ {(profil.deficit * 7 / 7700).toFixed(2)} kg/semaine. Un déficit doux (~500) est le plus tenable.</div>
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ maxWidth: "72%" }}>
            <div style={{ fontWeight: 700 }}>Créditer le sport</div>
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
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["jour", "Le jour même"], ["reparti", "Réparti sur 7 j"]].map(([k, l]) => (
                <button key={k} onClick={() => set("sportMode")(k)}
                  style={{ ...S.chip, flex: 1, fontSize: 13, ...((profil.sportMode ?? "jour") === k ? S.chipOn : {}) }}>{l}</button>
              ))}
            </div>
            <div style={S.sectionLabel}>Part du sport créditée : {profil.partSport ?? 60} %</div>
            <input type="range" min="0" max="100" step="10" value={profil.partSport ?? 60}
              onChange={(e) => set("partSport")(Number(e.target.value))} style={{ width: "100%", accentColor: C.green }} />
            <div style={{ ...S.miniMuted, marginTop: 4 }}>
              {(profil.sportMode ?? "jour") === "reparti"
                ? `2h de padel = ~1260 kcal → à ${profil.partSport ?? 60} %, cela ajoute ~${Math.round(1260 * (profil.partSport ?? 60) / 100 / 7)} kcal/jour lissés sur la semaine plutôt qu'un gros bonus d'un coup.`
                : `2h de padel = ~1260 kcal → à ${profil.partSport ?? 60} %, tu récupères ~${Math.round(1260 * (profil.partSport ?? 60) / 100)} kcal le jour même. 100 % = risque de surestimer ; ~50-60 % est plus sûr.`}
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
  { ic: "👋", bg: "#EAF1EB", img: "accueil.png", t: "Bienvenue sur NutriSuivi", d: "Ton carnet nutritionnel simple et honnête. Suis tes repas et ton poids sans te prendre la tête — et sans chiffres gravés dans le marbre." },
  { ic: "▦", bg: "#EAF1EB", img: "agenda.png", t: "L'agenda", d: "Chaque jour : ta cible du jour, ce que tu as mangé, et ton sport. Touche « + » sur un repas (Déjeuner, Dîner…) pour y ajouter directement, ou « Ajouter sport »." },
  { ic: "＋", bg: "#EEE8F6", img: "ajouter.png", t: "Ajouter un repas", d: "Quatre façons : la liste officielle (valeurs vérifiées), le code-barres, l'estimation par photo (IA), ou la saisie libre — tu écris ton repas, l'app cherche d'abord dans la liste officielle et n'estime par IA que ce qui manque (bien signalé)." },
  { ic: "📷", bg: "#EAF1EB", img: "scanner.png", t: "Scanne tes produits", d: "Scanne le code-barres d'un produit du supermarché : l'app va chercher ses valeurs nutritionnelles dans Open Food Facts (base collaborative, produits belges inclus) et te propose une fiche prête à valider. Une fois enregistré, le produit reste dans ta liste — tu ne rescannes plus jamais. Tu peux aussi scanner depuis l'onglet Liste pour construire ton catalogue perso." },
  { ic: "▤", bg: "#EAF5F6", img: "graphique.png", t: "Le graphique", d: "Suis tes calories, ton bilan net (mangé − dépensé), ta courbe de poids lissée et le déficit creusé par ton sport — par semaine ou par mois." },
  { ic: "◇", bg: "#FCF3E6", img: "profil.png", t: "Ton profil", d: "Ta cible se calcule selon ton activité quotidienne (métier) et ta fréquence de sport. Le sport te récompense par des résultats, pas par de la nourriture. Pèse-toi régulièrement : la balance est le juge." },
];
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
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: C.bg, display: "flex", flexDirection: "column", fontFamily: "'Inter',system-ui,sans-serif", color: C.ink }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 18px" }}>
        <button onClick={onDone} style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Passer</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 32px", maxWidth: 460, margin: "0 auto" }}>
        <div style={{ width: 92, height: 92, borderRadius: 26, background: s.bg, display: "grid", placeItems: "center", fontSize: 42, marginBottom: 28 }}>{s.ic}</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: -0.5 }}>{s.t}</div>
        <div style={{ fontSize: 16, color: "#3a4a40", marginTop: 14, lineHeight: 1.55 }}>{s.d}</div>
        <SlideShot name={s.img} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 22 }}>
        {SLIDES.map((_, k) => (
          <span key={k} style={{ width: k === i ? 22 : 7, height: 7, borderRadius: 4, background: k === i ? C.green : "#CFD8CD", transition: "width .2s" }} />
        ))}
      </div>
      <div style={{ padding: "0 24px 30px", maxWidth: 460, margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", gap: 10 }}>
        {i > 0 && (
          <button onClick={() => setI(i - 1)} style={{ padding: "15px 20px", borderRadius: 14, border: "1px solid #E1E6DC", background: "#fff", color: C.ink, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>‹</button>
        )}
        <button onClick={() => (last ? onDone() : setI(i + 1))}
          style={{ flex: 1, padding: "15px 0", borderRadius: 14, border: "none", background: C.green, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
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

        <button onClick={save} style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: C.green, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>C'est parti</button>
        <button onClick={onDone} style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", marginTop: 14, display: "block", width: "100%" }}>Passer</button>
      </div>
    </div>
  );
}
function Semaine({ diary, sport, poidsLog, water, cible, waterGoal }) {
  const dow = (new Date(todayISO()).getDay() + 6) % 7;
  const monday = shiftDate(todayISO(), -dow);
  const today = todayISO();
  const days = Array.from({ length: 7 }, (_, i) => shiftDate(monday, i));
  const passed = days.filter((d) => d <= today);
  const logged = passed.filter((d) => (diary[d] || []).length > 0);
  const kcals = logged.map((d) => sommeMacros(diary[d]).kcal);
  const avgKcal = kcals.length ? Math.round(kcals.reduce((a, b) => a + b, 0) / kcals.length) : 0;
  const inTarget = logged.filter((d) => sommeMacros(diary[d]).kcal <= cible).length;
  const sportKcal = Math.round(days.reduce((a, d) => a + sommeSport(sport[d]), 0));
  const waterAvg = passed.length ? (passed.reduce((a, d) => a + (water[d] || 0), 0) / passed.length) : 0;

  const sortedLog = [...(poidsLog || [])].sort((a, b) => a.date.localeCompare(b.date));
  let weightDelta = null;
  if (sortedLog.length >= 2) {
    const last = sortedLog[sortedLog.length - 1];
    const ref = [...sortedLog].reverse().find((x) => x.date <= shiftDate(last.date, -6)) || sortedLog[0];
    weightDelta = +(last.poids - ref.poids).toFixed(1);
  }

  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const Stat = ({ label, value, sub, color }) => (
    <div style={{ ...S.card, flex: 1, minWidth: 130 }}>
      <div style={S.miniMuted}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 24, color: color || C.ink, marginTop: 2 }}>{value}</div>
      {sub && <div style={{ ...S.miniMuted, fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 20, padding: "0 4px" }}>Ma semaine</div>

      <div style={S.card}>
        <div style={S.miniMuted}>Jours suivis</div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {days.map((d, i) => {
            const done = (diary[d] || []).length > 0;
            const future = d > today;
            return (
              <div key={d} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{jours[i]}</div>
                <div style={{ height: 30, borderRadius: 8, background: future ? "#EEF1EC" : done ? C.green : "#F0D9CE", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                  {future ? "" : done ? "✓" : "–"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="Moyenne kcal/jour" value={avgKcal || "—"} sub={`cible ${cible}`} color={avgKcal && avgKcal <= cible ? C.green : C.amber} />
        <Stat label="Jours dans la cible" value={`${inTarget}/${logged.length || 0}`} sub="repas complétés sous la cible" color={C.green} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="Déficit sport" value={`${sportKcal} kcal`} sub={`≈ ${Math.round(sportKcal / 7.7)} g de gras`} color="#2C7A86" />
        <Stat label="Hydratation" value={`${waterAvg.toFixed(1).replace(".", ",")} / ${waterGoal}`} sub="verres/jour en moyenne" color="#3E9CA8" />
      </div>

      <div style={S.card}>
        <div style={S.miniMuted}>Tendance de poids (7 jours)</div>
        {weightDelta === null ? (
          <div style={{ ...S.miniMuted, fontSize: 13, marginTop: 6 }}>Pèse-toi quelques jours pour voir ta tendance apparaître.</div>
        ) : (
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 24, marginTop: 2, color: weightDelta <= 0 ? C.green : C.amber }}>
            {weightDelta > 0 ? "+" : ""}{weightDelta.toString().replace(".", ",")} kg
          </div>
        )}
        <div style={{ ...S.miniMuted, fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
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
const C = {
  bg: "#F4F6F1", card: "#FFFFFF", ink: "#17241C", green: "#2C6E49",
  greenPale: "#EAF1EB", amber: "#E0912F", red: "#C0562B", muted: "#7C8A80",
};
const S = {
  app: { maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.bg, color: C.ink,
    fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", position: "relative" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 18px 12px", position: "sticky", top: 0, zIndex: 5, background: C.bg },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: -0.5, fontFamily: "'Space Grotesk', sans-serif" },
  sub: { fontSize: 12, color: C.muted, marginTop: 2 },
  main: { flex: 1, padding: "4px 14px 96px", overflowY: "auto" },
  card: { background: C.card, borderRadius: 18, padding: 16, border: "2px solid #E0E6DA", boxShadow: "0 2px 6px rgba(23,36,28,.07)" },
  nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480,
    display: "flex", justifyContent: "space-around", background: "#fff", borderTop: "1px solid #E6EAE2", padding: "8px 0 10px", zIndex: 10 },
  navBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", color: C.muted, cursor: "pointer", padding: "4px 12px" },
  navBtnOn: { color: C.green, fontWeight: 700 },
  bigNum: { fontSize: 30, fontWeight: 800, letterSpacing: -1, fontFamily: "'Space Grotesk', sans-serif" },
  miniMuted: { fontSize: 12, color: C.muted },
  sectionLabel: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.muted, marginBottom: 10 },
  dateArrow: { background: "none", border: "none", fontSize: 26, color: C.green, cursor: "pointer", width: 40 },
  entryRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid #F0F2ED" },
  thumb: { width: 40, height: 40, borderRadius: 9, objectFit: "cover" },
  del: { background: "#F6F8F3", border: "none", borderRadius: 8, width: 28, height: 28, fontSize: 18, color: C.muted, cursor: "pointer", flexShrink: 0 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #E1E6DC", fontSize: 15, background: "#FAFBF8", boxSizing: "border-box", outline: "none", color: C.ink },
  chip: { padding: "9px 14px", borderRadius: 20, border: "1px solid #E1E6DC", background: "#fff", fontSize: 14, cursor: "pointer", color: C.ink, textTransform: "capitalize" },
  chipOn: { background: C.green, color: "#fff", borderColor: C.green, fontWeight: 600 },
  foodRow: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 6px", background: "none", border: "none", borderBottom: "1px solid #F2F4EF", cursor: "pointer" },
  dot: { width: 9, height: 9, borderRadius: 5, flexShrink: 0 },
  qBtn: { flex: 1, padding: "8px 0", borderRadius: 10, border: "1px solid #E1E6DC", background: "#fff", fontSize: 13, cursor: "pointer", color: C.ink },
  calcBox: { display: "flex", justifyContent: "space-between", alignItems: "center", background: C.greenPale, borderRadius: 12, padding: "12px 14px", marginTop: 12 },
  photoBtn: { flex: 1, padding: "11px 0", borderRadius: 12, border: "1px dashed #C7D2C6", background: "#fff", fontSize: 14, cursor: "pointer", color: C.green, fontWeight: 600 },
  primaryBtn: { width: "100%", marginTop: 14, padding: "14px 0", borderRadius: 14, border: "none", background: C.green, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
  linkBtn: { background: "none", border: "none", color: C.green, fontSize: 13, cursor: "pointer", textDecoration: "underline" },
  radioRow: { display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", cursor: "pointer", fontSize: 14, color: C.ink },
  radioOn: { borderColor: C.green, background: C.greenPale, fontWeight: 600 },
  addDayBtn: { width: "100%", padding: "13px 0", borderRadius: 14, border: "2px solid rgba(23,36,28,0.12)", background: C.amber, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  addSmall: { padding: "8px 12px", borderRadius: 20, border: "none", background: C.green, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  sportAddBtn: { padding: "8px 12px", borderRadius: 20, border: "none", background: "#3E9CA8", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  copyBtn: { width: "100%", padding: "10px 0", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", color: C.green, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  favBtn: { padding: "5px 9px", borderRadius: 14, border: "1px solid #D8E2D6", background: "#F6F8F3", color: C.green, fontSize: 12, fontWeight: 700, cursor: "pointer" },
  badge: { fontSize: 10, background: C.greenPale, color: C.green, padding: "1px 6px", borderRadius: 6, marginLeft: 6, fontWeight: 700, verticalAlign: "middle" },
  // calendrier
  calHead: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 },
  calHeadCell: { textAlign: "center", fontSize: 11, color: C.muted, fontWeight: 600 },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 },
  calCell: { aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "#F6F8F3", border: "none", borderRadius: 10, cursor: "pointer", color: C.ink, position: "relative" },
  calCellSel: { background: C.green, color: "#fff" },
  calCellToday: { border: `2px solid ${C.green}` },
  calDot: { width: 5, height: 5, borderRadius: 3 },
  // sheet
  overlay: { position: "fixed", inset: 0, background: "rgba(23,36,28,.45)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  sheet: { width: "100%", maxWidth: 480, background: C.bg, borderRadius: "22px 22px 0 0", padding: "10px 16px 28px", maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box" },
  sheetGrab: { width: 40, height: 4, borderRadius: 3, background: "#CFD8CD", margin: "4px auto 12px" },
  // graphique
  tabPill: { flex: 1, padding: "11px 0", borderRadius: 12, border: "1px solid #E1E6DC", background: "#fff", fontSize: 14, fontWeight: 600, color: C.ink, cursor: "pointer" },
  tabPillOn: { background: C.ink, color: "#fff", borderColor: C.ink },
  miniTab: { padding: "7px 12px", borderRadius: 10, border: "1px solid #E1E6DC", background: "#fff", fontSize: 13, cursor: "pointer", color: C.ink },
  miniTabOn: { background: C.green, color: "#fff", borderColor: C.green, fontWeight: 600 },
  zoomBtn: { width: 32, height: 32, borderRadius: 9, border: "1px solid #E1E6DC", background: "#fff", fontSize: 18, cursor: "pointer", color: C.green, fontWeight: 700 },
  tooltip: { borderRadius: 10, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,.12)", fontSize: 13 },
};

function StyleInject() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap');
      * { -webkit-tap-highlight-color: transparent; }
      body { margin: 0; }
      input[type=range] { height: 24px; }
      ::-webkit-scrollbar { width: 0; height: 0; }
    `}</style>
  );
}
