export type Lang = "en" | "rw" | "fr" | "sw";

export interface Translations {
  nav: {
    home: string; services: string; research: string; doctors: string; about: string; contact: string;
  };
  hero: {
    welcome: string; tagline: string; subtitle: string;
  };
  about: {
    mission: string; missionText: string;
    vision: string; visionText: string;
    coreValues: string;
    honesty: string; honestyDesc: string;
    accountability: string; accountabilityDesc: string;
    dignity: string; dignityDesc: string;
    execSummary: string; execP1: string; execP2: string; execP3: string;
    missionVision: string; ourValues: string;
    excellence: string; excellenceDesc: string;
  };
  philosophy: {
    heading: string; text: string; learnMore: string;
    modalHeading: string; modalText: string; modalText2: string;
    researchAreas: string; close: string; joinSlogan: string;
  };
  services: {
    badge: string; heading: string; subtitle: string;
  };
  doctors: {
    badge: string; heading: string; subtitle: string;
    specialty: string; clinicalSpec: string; research: string;
    noPhoto: string;
  };
  research: {
    badge: string; heading: string; subtitle: string;
    team: string; areas: string; publications: string;
    education: string; partners: string;
    noPublications: string; addViaAdmin: string;
    noPhoto: string;
  };
  contact: {
    heading: string; subtitle: string;
    address: string; phone: string; email: string; hours: string;
    emergency: string; emergencyTitle: string; emergencySubtitle: string;
    findUs: string; findUsSubtitle: string; getDirections: string;
    satelliteDesc: string;
  };
  departments: {
    heading: string; medicalTitle: string; medicalDesc: string;
    researchTitle: string; researchDesc: string;
  };
  serviceCards?: {
    depts: Record<string, string>;
    subDepts: Record<string, string>;
    cards: Record<string, { title: string; description?: string }>;
  };
  footer: {
    tagline: string; quickLinks: string; aboutUs: string; ourDoctors: string;
    services: string; researchEd: string; ourServices: string; contactUs: string;
    emergencyHours: string; generalHours: string; rights: string;
  };
}

const en: Translations = {
  nav: {
    home: "Home", services: "Services", research: "Research & Education",
    doctors: "Doctors", about: "About Us", contact: "Contact",
  },
  hero: {
    welcome: "WELCOME TO UMURINZI PETROS MEDICAL CENTER",
    tagline: "Care by excellence with data curation",
    subtitle: "Umurinzi Petros Medical Center is a community-based healthcare and research center dedicated to transforming health through clinical excellence, innovation, and data-driven care. Guided by our core values of honesty, accountability, and dignity, our mission is to diagnose, treat, prevent disease, and educate communities and healthcare professionals.",
  },
  about: {
    mission: "Mission",
    missionText: "To be a leading center in internal medicine and pediatric care, with expertise in pulmonary and cardio-pulmonary health, delivering equitable, innovative, evidence-based care in Rwanda.",
    vision: "Vision",
    visionText: "To be the leading center in non-communicable diseases and cardio-pulmonary health, providing patient-centered care, research, and innovation across Rwanda.",
    coreValues: "Core Values",
    honesty: "Honesty", honestyDesc: "Truth and transparency in every clinical and administrative decision.",
    accountability: "Accountability", accountabilityDesc: "Full responsibility for outcomes, always prioritising patient safety.",
    dignity: "Dignity", dignityDesc: "Every patient treated with utmost respect, regardless of circumstance.",
    execSummary: "Executive Summary",
    execP1: "Umurinzi Petros Medical Center is a community-based healthcare and research center dedicated to transforming health through clinical excellence, innovation, and data-driven care. Guided by our core values of honesty, accountability, and dignity, our mission is to diagnose, treat, prevent disease, and educate communities and healthcare professionals.",
    execP2: "Since commencing operations in Rwanda in January 2024, UPMC has focused on advancing care for chronic diseases, particularly respiratory diseases, while strengthening medical education and research capacity. We actively collaborate with local and international institutions to implement sustainable clinical, research, and training programs that improve health outcomes.",
    execP3: "UPMC welcomes partnerships with academic institutions, healthcare organizations, researchers, and philanthropic partners who share our vision of building equitable, evidence-based healthcare systems and expanding access to high-quality respiratory care across Rwanda and the region.",
    missionVision: "Mission & Vision",
    ourValues: "Our Values",
    excellence: "Excellence", excellenceDesc: "Delivering the highest standard of clinical care in every interaction, every day.",
  },
  philosophy: {
    heading: "Research and Education",
    text: "Through training in Methods in Epidemiologic, Clinical and Operations Research (MECOR), UPMC's founder contributes to Chest Africa and RACE, multinational observational studies conducted in Rwanda. UPMC's motto, \"Data Driven Patient Care of Excellence\", is the culture we cultivate among our employees.",
    learnMore: "Learn More About Us",
    modalHeading: "Research and Education",
    modalText: "Through MECOR training, UPMC's founder contributes to Chest Africa and RACE, multinational observational studies conducted in Rwanda.",
    modalText2: "UPMC's motto, \"Data Driven Patient Care of Excellence\", is central to our work culture.",
    researchAreas: "Research Areas of Interest",
    joinSlogan: "We invite you to join our mission: \"Data Driven Patient Care of Excellence.\" Contact us to explore partnership opportunities.",
    close: "Close",
  },
  services: {
    badge: "Our Services", heading: "Specialised Care",
    subtitle: "Expert medical services across Internal Medicine and Pediatrics.",
  },
  doctors: {
    badge: "Our Medical Team", heading: "Meet Our Doctors",
    subtitle: "Experienced specialists dedicated to your wellbeing",
    specialty: "Specialty", clinicalSpec: "Clinical Specialisation", research: "Research Focus",
    noPhoto: "Photo coming soon",
  },
  research: {
    badge: "Research & Education",
    heading: "Advancing Medicine Through Research & Education",
    subtitle: "Umurinzi Petros Medical Center is committed to advancing the frontiers of clinical medicine through rigorous, evidence-based research and structured professional education.",
    team: "Our Team", areas: "Research Areas", publications: "Our Publications",
    education: "Education", partners: "Research Partners",
    noPublications: "No publications yet",
    addViaAdmin: "Add publications via the Admin Panel",
    noPhoto: "Photo uploaded via Admin Panel",
  },
  departments: {
    heading: "Our Departments",
    medicalTitle: "Medical Department",
    medicalDesc: "Dedicated to delivering compassionate, high-quality clinical care through general consultation, internal medicine, cardiology, pediatrics, and hospitalisation services.",
    researchTitle: "Research Department",
    researchDesc: "Committed to advancing medical knowledge through evidence-based science, CPD training, and continuous medical education for healthcare professionals.",
  },
  contact: {
    heading: "Contact Umurinzi Petros Medical Center",
    subtitle: "We're here to help you with all your healthcare needs. Reach out to us for appointments, information, or emergency care.",
    address: "Address", phone: "Phone", email: "Email", hours: "Hours",
    emergency: "Emergency",
    emergencyTitle: "Emergency Services Available 24/7",
    emergencySubtitle: "For life-threatening emergencies, call +250 795 161 628 or come directly to our Emergency Department.",
    findUs: "Find Us", findUsSubtitle: "Rwanda, Northern Province · Muhanga District · Nyamabuye Sector",
    getDirections: "Get Directions",
    satelliteDesc: "High-resolution satellite view. Click to open Google Maps and get directions.",
  },
  footer: {
    tagline: "Providing exceptional healthcare with compassion and expertise. Your health and wellbeing are our top priorities.",
    quickLinks: "Quick Links", aboutUs: "About Us", ourDoctors: "Our Doctors",
    services: "Services", researchEd: "Research & Education",
    ourServices: "Our Services", contactUs: "Contact Us",
    emergencyHours: "Emergency: 24/7", generalHours: "General: Monday to Sunday",
    rights: "©Umurinzi Petros Medical Center. All rights reserved.",
  },
};

const rw: Translations = {
  nav: {
    home: "Ahabanza", services: "Serivisi", research: "Ubushakashatsi n'Uburezi",
    doctors: "Abaganga", about: "Ibitwerekeye", contact: "Twandikire",
  },
  hero: {
    welcome: "MURAKAZA NEZA KU BITARO BY'UMURINZI PETROS",
    tagline: "Ubuvuzi bw'inzobere bushingiye ku makuru y'izewe",
    subtitle: "Ku Bitaro by'Umurinzi Petros, dutanga ubuvuzi bw'inzobere burangwa n'ubunyamwuga n'ubushishozi. Itsinda ryacu ry'abaganga biyemeje gushyira imbere ubuzima bwawe no gukira kwawe.",
  },
  about: {
    mission: "Inshingano",
    missionText: "Kuba ibitaro by'icyitegererezo mu buvuzi bw'indwara z'imbere no mu buvuzi bw'abana, bifite ubunararibonye mu buzima bw'ibihaha n'umutima, bitanga ubuvuzi bungana kuri bose, buhanga kandi bushingiye ku bimenyetso mu Rwanda.",
    vision: "Icyerekezo",
    visionText: "Kuba ibitaro biyoboye mu kuvura indwara zitandura no guteza imbere ubuzima bw'umutima n'ibihaha, bitanga ubuvuzi bushyira umurwayi ku isonga, ubushakashatsi n'udushya mu Rwanda hose.",
    coreValues: "Indangagaciro Z'ibanze",
    honesty: "Ubunyangamugayo", honestyDesc: "Ukuri n'umucyo muri buri cyemezo cy'ubuvuzi n'icy'ubuyobozi.",
    accountability: "Kubazwa inshingano", accountabilityDesc: "Kwemera inshingano ku musaruro w'ibikorwa byacu, dushyira imbere buri gihe umutekano w'umurwayi.",
    dignity: "Icyubahiro", dignityDesc: "Buri murwayi afatwa mu cyubahiro gikwiye, hatitawe ku mimerere arimo.",
    execSummary: "Incamake y'Ibyo Tukora",
    execP1: "Ibitaro by'Umurinzi Petros ni ibitaro by'ubuvuzi n'ubushakashatsi byashingiye ku muturage, byibanda ku guhindura ubuzima binyuze mu bubasha mu buvuzi, ubuhanga, no gukoresha amakuru mu buvuzi. Biyobora indangagaciro zacu zo gukora neza, kubazwa inshingano, no kubaha agaciro, inshingano yacu ni ugusuzuma, kuvura, kurinda indwara, no kwigisha abaturage n'abakozi b'ubuvuzi.",
    execP2: "Kuva mu Gushyingo 2024 tugiye gutangira imirimo mu Rwanda, UPMC yibanda ku kuzamura ubuvuzi bw'indwara zikomeye, cyane cyane indwara z'ubuhumekero, mu gihe cyongera imbaraga mu burezi bw'ubuvuzi n'ubushobozi bwo gukora ubushakashatsi. Dufatanya bikorwa n'ibigo bya hano n'by'amahanga mu gushyira mu bikorwa gahunda z'ubuvuzi, ubushakashatsi, n'amahugurwa zikomeza zigira akamaro mu kuzamura ibisubizo by'ubuzima.",
    execP3: "UPMC yemera gufatanya n'ibigo by'amashuri makuru, ibigo by'ubuvuzi, abashakashatsi, n'abafatanyabikorwa b'impuguke bashyizeho ibyifuzo byacu byo kubaka ubuvuzi bungana bushingiye ku bimenyetso, no kwagura ubuvuzi bw'ubuhumekero bwiza mu Rwanda no mu karere.",
    missionVision: "Inshingano n'Icyerekezo",
    ourValues: "Indangagaciro Zacu",
    excellence: "Ubwiza", excellenceDesc: "Kugaburira igipimo cyisumbuye cy'ubuvuzi mu buri guhera, buri munsi.",
  },
  philosophy: {
    heading: "Ubushakashatsi n'Uburezi",
    text: "Nyuma yo kurangiza amahugurwa ya Methods in Epidemiologic, Clinical and Operations Research (MECOR), uwashinze UPMC agira uruhare mu bikorwa bya Chest Africa na RACE, ubushakashatsi mpuzamahanga bukorerwa mu Rwanda. Intego ya UPMC, \"Data Driven Patient Care of Excellence\", ni umuco dutoza kandi dukomeza mu bakozi bacu.",
    learnMore: "Menya byinshi kuri twe",
    modalHeading: "Ubushakashatsi n'Uburezi",
    modalText: "Binyuze mu mahugurwa ya MECOR, uwashinze UPMC agira uruhare mu bushakashatsi bwa Chest Africa na RACE bukorerwa mu Rwanda.",
    modalText2: "Intego ya UPMC, \"Data Driven Patient Care of Excellence\", ni ishingiro ry'umuco wacu w'akazi.",
    researchAreas: "Ibyiciro by'Ubushakashatsi",
    joinSlogan: "Turakwakira ngo dufatanye mu ntego yacu: \"Data Driven Patient Care of Excellence.\" Twandikire ku rupapuro rw'itumanaho kugira ngo tugirane ubufatanye.",
    close: "Funga",
  },
  services: {
    badge: "Serivisi Zacu", heading: "Ubuvuzi Dufite",
    subtitle: "Serivisi z'ubuvuzi bw'inzobere mu ndwara z'imbere mumubiri no mu buvuzi bw'abana.",
  },
  doctors: {
    badge: "Itsinda Ryacu ry'Ubuvuzi", heading: "Abaganga Bacu",
    subtitle: "Inzobere zifite ubunararibonye kandi zishyira imbere imibereho myiza yawe",
    specialty: "Umwihariko", clinicalSpec: "Ubuzobere mu Buvuzi", research: "Icyerekezo cy'Ubushakashatsi",
    noPhoto: "Ifoto izashyirwaho vuba",
  },
  research: {
    badge: "Ubushakashatsi n'Uburezi",
    heading: "Guteza Imbere Ubuvuzi Binyuze mu Bushakashatsi n'Uburezi",
    subtitle: "Ibitaro by'Umurinzi Petros byiyemeje guteza imbere ubuvuzi bwa kliniki binyuze mu bushakashatsi bukomeye bushingiye ku bimenyetso, no mu burezi bw'inzobere buteguye neza.",
    team: "Itsinda Ryacu", areas: "Ibyiciro by'Ubushakashatsi", publications: "Ibyasohotse mu Bushakashatsi",
    education: "Uburezi", partners: "Abafatanyabikorwa mu Bushakashatsi",
    noPublications: "Nta byasohotse birashyirwaho",
    addViaAdmin: "Ongeraho ibyasohotse ukoresheje Akanama k'Ubuyobozi",
    noPhoto: "Ifoto ishyirwaho binyuze mu buyobozi",
  },
  serviceCards: {
    depts: {
      "General Consultation": "Isuzuma Rusange",
      "Internal Medicine": "Indwara z'Imbere mu Mubiri",
      "Pediatrics": "Ubuvuzi bw'Abana",
      "CPD Training": "Amahugurwa ya CPD",
    },
    subDepts: {
      "Pulmonology": "Ubuvuzi bw'Ibihaha",
      "Cardiology": "Ubuvuzi bw'Umutima",
      "Hospitalisation": "Kwinjizwa mu Bitaro",
    },
    cards: {
      "general-consultation": { title: "Isuzuma Rusange", description: "Isuzuma ry'ubuvuzi rya mbere rigenewe abarwayi bo mu myaka yose." },
      "spirometry": { title: "Spirometri", description: "Ikizamini gipima ingufu zo guhumeka kw'ibihaha kigamije kugaragaza no gukurikirana indwara z'ubuhumecyero." },
      "epet": { title: "Ikizamini cy'Imyitozo (EPET)", description: "Ikizamini cy'inzobere gipima uko umutima n'ibihaha bikora mu gihe cy'imyitozo y'imubiri." },
      "chester": { title: "Ikizamini cy'Imyitozo cya Chester", description: "Ikizamini cya standard kigaragaza imbaraga z'umutima." },
      "endoscopy-pulmo": { title: "Endoskopi (Ibihaha)" },
      "cardiology": { title: "Ubuvuzi bw'Umutima" },
      "ecg": { title: "Electrokardiografi (ECG)" },
      "echocardiography": { title: "Ekokardiografi" },
      "hospitalisation-internal": { title: "Kwinjizwa mu Bitaro" },
      "pediatric-consult": { title: "Isuzuma Rusange ry'Abana" },
      "endoscopy-peds": { title: "Endoskopi (Abana)" },
      "hospitalisation-peds": { title: "Kwinjizwa mu Bitaro (Abana)" },
      "cpd-training": { title: "Amahugurwa ya CPD" },
    },
  },
  departments: {
    heading: "Amashami Yacu",
    medicalTitle: "Ishami ry'Ubuvuzi",
    medicalDesc: "Ibitaro bya UPMC bitanga ubuvuzi bw'inzobere burangwa n'ubunyamwuga. Dufite isuzuma rusange, indwara z'imbere mu mubiri, ubuvuzi bw'indwara z'umutima, ubuvuzi bw'abana, hamwe na serivisi zo kwinjizwa mu bitaro.",
    researchTitle: "Ishami ry'Ubushakashatsi",
    researchDesc: "Ibitaro bya UPMC byiyemeje guteza imbere ubumenyi bw'ubuvuzi binyuze mu bushakashatsi bushingiye ku makuru, amahugurwa ya CPD, n'uburezi buhoraho bw'inzobere mu mwuga w'ubuvuzi.",
  },
  contact: {
    heading: "Twandikire ku Bitaro by'Umurinzi Petros",
    subtitle: "Turi hano kugira ngo tugufashe mu byo ukeneye byose bijyanye n'ubuzima. Twandikire usabe gahunda, amakuru cyangwa ubufasha bwihutirwa.",
    address: "Aderesi", phone: "Telefoni", email: "Imeli", hours: "Amasaha y'Akazi",
    emergency: "Ubutabazi bwihutirwa",
    emergencyTitle: "Serivisi z'Ubutabazi bwihutirwa ziboneka 24/7",
    emergencySubtitle: "Mu bihe byihutirwa bishobora gushyira ubuzima mu kaga, hamagara +250 795 161 628 cyangwa ugane ako kanya ishami ryacu ry'ubutabazi bwihutirwa.",
    findUs: "Aho Duherereye", findUsSubtitle: "Rwanda, Intara y'Amajyaruguru · Akarere ka Muhanga · Umurenge wa Nyamabuye",
    getDirections: "Reba Inzira",
    satelliteDesc: "Reba aho duherereye ku ikarita y'ijana. Kanda kuri yo kugira ngo ugureho Google Maps ubone inzira.",
  },
  footer: {
    tagline: "Dutanga ubuvuzi buhebuje burangwa n'impuhwe n'ubunararibonye. Ubuzima bwawe n'imibereho myiza yawe ni byo dushyira imbere.",
    quickLinks: "Amahuza Yihuse", aboutUs: "Ibitwerekeye", ourDoctors: "Abaganga Bacu",
    services: "Serivisi", researchEd: "Ubushakashatsi n'Uburezi",
    ourServices: "Serivisi Zacu", contactUs: "Twandikire",
    emergencyHours: "Ubutabazi bwihutirwa: 24/7", generalHours: "Rusange: Kuwa Mbere kugeza Ku Cyumweru",
    rights: "©Ibitaro by'Umurinzi Petros. Uburenganzira bwose burabitswe.",
  },
};

const fr: Translations = {
  nav: {
    home: "Accueil", services: "Services", research: "Recherche & Éducation",
    doctors: "Médecins", about: "À Propos", contact: "Contact",
  },
  hero: {
    welcome: "BIENVENUE AU CENTRE MÉDICAL UMURINZI PETROS",
    tagline: "Soins d'excellence par la curation des données",
    subtitle: "Au Centre Médical Umurinzi Petros, nous offrons des soins médicaux experts avec compassion et précision. Notre équipe de spécialistes dévoués s'engage pour votre santé, votre rétablissement et votre tranquillité d'esprit à chaque étape de votre parcours.",
  },
  about: {
    mission: "Mission",
    missionText: "Être un centre de référence en médecine interne et en pédiatrie, avec une expertise en santé pulmonaire et cardio-pulmonaire, en dispensant des soins équitables, innovants et fondés sur des données probantes au Rwanda.",
    vision: "Vision",
    visionText: "Être le centre de référence pour les maladies non transmissibles et la santé cardio-pulmonaire, offrant des soins centrés sur le patient, de la recherche et de l'innovation à travers tout le Rwanda.",
    coreValues: "Valeurs Fondamentales",
    honesty: "Honnêteté", honestyDesc: "Vérité et transparence dans chaque décision clinique et administrative.",
    accountability: "Responsabilité", accountabilityDesc: "Pleine responsabilité des résultats, en privilégiant toujours la sécurité du patient.",
    dignity: "Dignité", dignityDesc: "Chaque patient traité avec le plus grand respect, quelles que soient les circonstances.",
    execSummary: "Résumé Exécutif",
    execP1: "Le Centre Médical Umurinzi Petros est un centre de soins de santé et de recherche basé dans la communauté, dédié à la transformation de la santé par l'excellence clinique, l'innovation et les soins fondés sur les données. Guidé par nos valeurs fondamentales d'honnêteté, de responsabilité et de dignité, notre mission est de diagnostiquer, traiter, prévenir les maladies et éduquer les communautés et les professionnels de santé.",
    execP2: "Depuis le début de nos opérations au Rwanda en janvier 2024, l'UPMC s'est concentré sur l'amélioration des soins pour les maladies chroniques, en particulier les maladies respiratoires, tout en renforçant l'éducation médicale et la capacité de recherche. Nous collaborons activement avec des institutions locales et internationales pour mettre en œuvre des programmes cliniques, de recherche et de formation durables qui améliorent les résultats de santé.",
    execP3: "L'UPMC accueille favorablement les partenariats avec les institutions académiques, les organisations de santé, les chercheurs et les partenaires philanthropiques qui partagent notre vision de construire des systèmes de santé équitables et fondés sur des données probantes, et d'élargir l'accès à des soins respiratoires de haute qualité au Rwanda et dans la région.",
    missionVision: "Mission & Vision",
    ourValues: "Nos Valeurs",
    excellence: "Excellence", excellenceDesc: "Offrir le plus haut niveau de soins cliniques à chaque interaction, chaque jour.",
  },
  philosophy: {
    heading: "Recherche et Éducation",
    text: "Diplômé des Méthodes de Recherche en Épidémiologie, Clinique et Opérations (MECOR), le fondateur d'UPMC contribue à la conduite de Chest Africa et RACE, études observationnelles multinationales au Rwanda. La devise d'UPMC « Soins d'Excellence Guidés par les Données » est la culture à inculquer aux employés.",
    learnMore: "En savoir plus sur nous",
    modalHeading: "Recherche et Éducation",
    modalText: "Par sa formation au MECOR, le fondateur d'UPMC contribue aux études Chest Africa et RACE au Rwanda.",
    modalText2: "La devise d'UPMC « Soins d'Excellence Guidés par les Données » est au cœur de notre culture d'entreprise.",
    researchAreas: "Domaines de Recherche",
    joinSlogan: "Nous vous invitons à rejoindre notre slogan : « Soins d'Excellence Guidés par les Données. » Contactez-nous pour un partenariat.",
    close: "Fermer",
  },
  services: {
    badge: "Nos Services", heading: "Soins Spécialisés",
    subtitle: "Services médicaux experts en Médecine Interne et Pédiatrie.",
  },
  doctors: {
    badge: "Notre Équipe Médicale", heading: "Nos Médecins",
    subtitle: "Des spécialistes expérimentés dédiés à votre bien-être",
    specialty: "Spécialité", clinicalSpec: "Spécialisation Clinique", research: "Axe de Recherche",
    noPhoto: "Photo à venir",
  },
  research: {
    badge: "Recherche & Éducation",
    heading: "Faire Progresser la Médecine par la Recherche et l'Éducation",
    subtitle: "Le Centre Médical Umurinzi Petros s'engage à repousser les frontières de la médecine clinique grâce à une recherche rigoureuse et fondée sur les données probantes.",
    team: "Notre Équipe", areas: "Domaines de Recherche", publications: "Nos Publications",
    education: "Éducation", partners: "Partenaires de Recherche",
    noPublications: "Aucune publication pour l'instant",
    addViaAdmin: "Ajoutez des publications via le Panneau Admin",
    noPhoto: "Photo ajoutée via le panneau d'administration",
  },
  departments: {
    heading: "Nos Départements",
    medicalTitle: "Département Médical",
    medicalDesc: "Dévoué à offrir des soins cliniques de haute qualité avec compassion, incluant les consultations générales, la médecine interne, la cardiologie, la pédiatrie et l'hospitalisation.",
    researchTitle: "Département de Recherche",
    researchDesc: "Engagé à faire avancer les connaissances médicales grâce à la science fondée sur les preuves, la formation continue et l'éducation médicale continue pour les professionnels de santé.",
  },
  contact: {
    heading: "Contacter le Centre Médical Umurinzi Petros",
    subtitle: "Nous sommes là pour vous aider dans tous vos besoins de santé. Contactez-nous pour des rendez-vous, des informations ou des soins d'urgence.",
    address: "Adresse", phone: "Téléphone", email: "E-mail", hours: "Horaires",
    emergency: "Urgence",
    emergencyTitle: "Services d'Urgence Disponibles 24h/24 et 7j/7",
    emergencySubtitle: "Pour les urgences vitales, appelez le +250 795 161 628 ou rendez-vous directement aux urgences.",
    findUs: "Nous Trouver", findUsSubtitle: "Rwanda, Province du Nord · District de Muhanga · Secteur de Nyamabuye",
    getDirections: "Obtenir l'Itinéraire",
    satelliteDesc: "Vue satellite en haute résolution. Cliquez pour ouvrir Google Maps et obtenir l'itinéraire.",
  },
  footer: {
    tagline: "Offrant des soins de santé exceptionnels avec compassion et expertise. Votre santé et votre bien-être sont nos priorités.",
    quickLinks: "Liens Rapides", aboutUs: "À Propos", ourDoctors: "Nos Médecins",
    services: "Services", researchEd: "Recherche & Éducation",
    ourServices: "Nos Services", contactUs: "Nous Contacter",
    emergencyHours: "Urgences : 24h/24", generalHours: "Général : Lundi au Dimanche",
    rights: "©Centre Médical Umurinzi Petros. Tous droits réservés.",
  },
};

const sw: Translations = {
  nav: {
    home: "Nyumbani", services: "Huduma", research: "Utafiti & Elimu",
    doctors: "Madaktari", about: "Kuhusu Sisi", contact: "Wasiliana",
  },
  hero: {
    welcome: "KARIBU KATIKA KITUO CHA MATIBABU CHA UMURINZI PETROS",
    tagline: "Huduma bora kupitia utunzaji wa takwimu",
    subtitle: "Katika Kituo cha Matibabu cha Umurinzi Petros, tunatoa huduma za matibabu ya kitaalamu kwa huruma na usahihi. Timu yetu ya wataalamu waliojitoa inajihusisha na afya yako, kupona kwako, na amani ya akili yako katika kila hatua ya safari yako.",
  },
  about: {
    mission: "Dhamira",
    missionText: "Kuwa kituo cha matibabu kinachongoza katika dawa ya ndani na ya watoto, chenye utaalamu katika afya ya mapafu, kikitoa huduma sawa, za ubunifu na zinazotegemea ushahidi nchini Rwanda.",
    vision: "Maono",
    visionText: "Kuwa kituo kinachongoza katika magonjwa yasiyoambukiza na afya ya moyo-mapafu, kikitoa huduma zinazomwangalia mgonjwa, utafiti na ubunifu katika Rwanda yote.",
    coreValues: "Maadili Msingi",
    honesty: "Uaminifu", honestyDesc: "Ukweli na uwazi katika kila uamuzi wa kimatibabu na kiutawala.",
    accountability: "Uwajibikaji", accountabilityDesc: "Jukumu kamili la matokeo, huku ikizingatiwa usalama wa mgonjwa.",
    dignity: "Heshima", dignityDesc: "Kila mgonjwa huhudumiwa kwa heshima kubwa, bila kujali hali yake.",
    execSummary: "Muhtasari Mkuu",
    execP1: "Kituo cha Matibabu cha Umurinzi Petros ni kituo cha afya na utafiti kinachotegemea jamii, kilichojitolea kubadilisha afya kupitia ubora wa kimatibabu, ubunifu, na huduma zinazotegemea takwimu. Kukiakia maadili yetu msingi ya uaminifu, uwajibikaji, na heshima, dhamira yetu ni kuchunguza, kutibu, kuzuia magonjwa, na kuelimisha jamii na wataalamu wa afya.",
    execP2: "Tangu kuanza shughuli nchini Rwanda mwezi Januari 2024, UPMC imejikita katika kuboresha huduma kwa magonjwa sugu, hasa magonjwa ya kupumua, huku ikimarisha elimu ya matibabu na uwezo wa utafiti. Tunashirikiana kwa bidii na taasisi za ndani na za kimataifa kutekeleza programu za kimatibabu, utafiti, na mafunzo zinazodumu na kuboresha matokeo ya afya.",
    execP3: "UPMC kukaribisha ushirikiano na taasisi za kiakademia, mashirika ya afya, watafiti, na wafadhili wanaoshiriki maono yetu ya kujenga mifumo ya afya inayolingana na inayotegemea ushahidi, na kupanua ufikiaji wa huduma bora za matibabu ya kupumua nchini Rwanda na katika eneo hilo.",
    missionVision: "Dhamira & Maono",
    ourValues: "Maadili Yetu",
    excellence: "Ubora", excellenceDesc: "Kutoa kiwango cha juu zaidi cha huduma ya kimatibabu kwenye kila mwingiliano, kila siku.",
  },
  philosophy: {
    heading: "Utafiti na Elimu",
    text: "Kupitia mafunzo ya Mbinu za Utafiti wa Epidemiolojia, Kliniki na Uendeshaji (MECOR), Mwanzilishi wa UPMC anachangia tafiti za Chest Africa na RACE, tafiti za kimataifa zinazofanyika nchini Rwanda. Kauli mbiu ya UPMC 'Data Driven Patient Care of Excellence' ndiyo utamaduni tunaoujenga kwa wafanyakazi wetu.",
    learnMore: "Jifunze Zaidi Kutuhusu",
    modalHeading: "Utafiti na Elimu",
    modalText: "Kupitia mafunzo ya MECOR, Mwanzilishi wa UPMC anasaidia kufanya utafiti wa Chest Africa na RACE nchini Rwanda.",
    modalText2: "Kauli mbiu ya UPMC 'Data Driven Patient Care of Excellence' ni msingi wa utamaduni wetu.",
    researchAreas: "Maeneo ya Utafiti",
    joinSlogan: "Tunakukaribisha kuungana nasi katika dhamira yetu: 'Data Driven Patient Care of Excellence.' Wasiliana nasi kupitia ukurasa wa mawasiliano ili tushirikiane.",
    close: "Funga",
  },
  services: {
    badge: "Huduma Zetu", heading: "Huduma Maalum",
    subtitle: "Huduma za kimatibabu katika Dawa ya Ndani na ya Watoto.",
  },
  doctors: {
    badge: "Timu Yetu ya Kimatibabu", heading: "Madaktari Wetu",
    subtitle: "Wataalamu wenye uzoefu wanaojali ustawi wako",
    specialty: "Utaalamu", clinicalSpec: "Utaalamu wa Kimatibabu", research: "Mwelekeo wa Utafiti",
    noPhoto: "Picha inakuja hivi karibuni",
  },
  research: {
    badge: "Utafiti & Elimu",
    heading: "Kuendeleza Dawa Kupitia Utafiti na Elimu",
    subtitle: "Kituo cha Matibabu cha Umurinzi Petros kinajitolea kuendeleza mipaka ya dawa ya kimatibabu kupitia utafiti mkali na unaotegemea ushahidi.",
    team: "Timu Yetu", areas: "Maeneo ya Utafiti", publications: "Machapisho Yetu",
    education: "Elimu", partners: "Washirika wa Utafiti",
    noPublications: "Hakuna machapisho bado",
    addViaAdmin: "Ongeza machapisho kupitia Paneli ya Msimamizi",
    noPhoto: "Picha imepakiwa kupitia Msimamizi",
  },
  departments: {
    heading: "Idara Zetu",
    medicalTitle: "Idara ya Matibabu",
    medicalDesc: "Ilijitolea kutoa huduma za kliniki za hali ya juu kwa huruma, zinazojumuisha ushauri wa jumla, dawa ya ndani, kadiolojia, matibabu ya watoto, na huduma za kulazwa hospitalini.",
    researchTitle: "Idara ya Utafiti",
    researchDesc: "Imejitolea kuendeleza maarifa ya matibabu kupitia sayansi inayotegemea ushahidi, mafunzo ya CPD, na elimu ya kuendelea ya matibabu kwa wataalamu wa afya.",
  },
  contact: {
    heading: "Wasiliana na Kituo cha Matibabu cha Umurinzi Petros",
    subtitle: "Tuko hapa kukusaidia katika mahitaji yako yote ya afya. Wasiliana nasi kwa miadi, habari au huduma za dharura.",
    address: "Anwani", phone: "Simu", email: "Barua Pepe", hours: "Masaa ya Kazi",
    emergency: "Dharura",
    emergencyTitle: "Huduma za Dharura Zinapatikana 24/7",
    emergencySubtitle: "Kwa dharura zinazotishia maisha, piga simu +250 795 161 628 au nenda moja kwa moja katika idara yetu ya dharura.",
    findUs: "Tupate", findUsSubtitle: "Rwanda, Mkoa wa Kaskazini · Wilaya ya Muhanga · Sekta ya Nyamabuye",
    getDirections: "Pata Mwelekeo",
    satelliteDesc: "Muonekano wa setilaiti wa resolution ya juu. Bofya kufungua Google Maps na kupata mwelekeo.",
  },
  footer: {
    tagline: "Kutoa huduma za afya bora kwa huruma na utaalamu. Afya yako na ustawi wako ni kipaumbele chetu.",
    quickLinks: "Viungo Vya Haraka", aboutUs: "Kuhusu Sisi", ourDoctors: "Madaktari Wetu",
    services: "Huduma", researchEd: "Utafiti & Elimu",
    ourServices: "Huduma Zetu", contactUs: "Wasiliana Nasi",
    emergencyHours: "Dharura: 24/7", generalHours: "Kawaida: Jumatatu hadi Jumapili",
    rights: "©Kituo cha Matibabu cha Umurinzi Petros. Haki zote zimehifadhiwa.",
  },
};

export const TRANSLATIONS: Record<Lang, Translations> = { en, rw, fr, sw };

export const LANG_LABELS: Record<Lang, string> = {
  en: "English", rw: "Kinyarwanda", fr: "Français", sw: "Kiswahili",
};

export const LANG_FLAGS: Record<Lang, string> = {
  en: "🇬🇧", rw: "🇷🇼", fr: "🇫🇷", sw: "🇰🇪",
};
