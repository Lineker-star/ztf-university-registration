# ZTF University Institute — Online Registration System
## Claude Code Master Build Prompt
### Project: register.ztfuniversity.com | Stack: Next.js 14 + Supabase + Hostinger

---

## 🎯 PROJECT OVERVIEW

Build a **complete, production-ready, bilingual (English/French) online student registration system** for ZTF University Institute, hosted at `register.ztfuniversity.com` on Hostinger (Node.js deployment). The system has two parts:
1. **Public Registration Portal** — students register in 6 stages
2. **Admin Management System** — staff manage all registrations, documents, and data

---

## 🛠 TECH STACK

```
Framework:        Next.js 14 (App Router)
Language:         TypeScript
Database:         Supabase (PostgreSQL + Storage + Auth)
Styling:          Tailwind CSS + shadcn/ui
i18n:             next-intl (English + French)
File Storage:     Supabase Storage (images, PDFs, Excel files)
Auth:             Supabase Auth (admin only)
Email:            Resend (registration confirmations)
Export:           xlsx + jsPDF (admin exports)
Deployment:       Hostinger Node.js (PM2)
Forms:            React Hook Form + Zod validation
```

---

## 📁 PROJECT INITIALIZATION

```bash
npx create-next-app@latest ztf-registration --typescript --tailwind --app --src-dir
cd ztf-registration
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea badge table dialog alert progress toast separator tabs
npm install next-intl @supabase/supabase-js @supabase/ssr react-hook-form zod @hookform/resolvers
npm install xlsx jspdf jspdf-autotable
npm install resend
npm install react-dropzone
npm install date-fns
npm install lucide-react
npm install clsx tailwind-merge
```

---

## 🌍 BILINGUAL i18n SETUP

### File: `src/i18n.ts`
```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
```

### File: `src/middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|admin-api|.*\\..*).*)']
};
```

### File: `src/messages/en.json` — COMPLETE ENGLISH TRANSLATIONS
```json
{
  "nav": {
    "home": "Home",
    "register": "Register",
    "login": "Admin Login",
    "back_to_main": "Back to ZTF University",
    "language": "Français"
  },
  "home": {
    "title": "ZTF University Institute",
    "subtitle": "Online Student Registration Portal",
    "description": "Begin your academic journey at ZTF University Institute. Complete your registration online in just a few steps.",
    "start_registration": "Start Registration",
    "check_status": "Check Application Status",
    "programmes": "Our Programmes",
    "anglophone_programmes": "Anglophone Programmes",
    "francophone_programmes": "Francophone Programmes",
    "hnd": "Higher National Diploma (HND)",
    "btech": "Bachelor of Technology (BTech)",
    "mtech": "Master of Technology (MTech)",
    "bts": "Brevet de Technicien Supérieur (BTS)",
    "licence": "Licence Professionnelle",
    "master": "Master Professionnel",
    "requirements": "Admission Requirements",
    "contact": "Contact Admissions",
    "steps_title": "Registration in 6 Simple Steps",
    "step1": "Personal Information",
    "step2": "Academic Background",
    "step3": "Programme Selection",
    "step4": "Document Upload",
    "step5": "Emergency & Guardian Info",
    "step6": "Review & Submit"
  },
  "steps": {
    "step1_title": "Personal Information",
    "step2_title": "Academic Background",
    "step3_title": "Programme Selection",
    "step4_title": "Document Upload",
    "step5_title": "Guardian & Emergency Contact",
    "step6_title": "Review & Submit",
    "next": "Next Step",
    "previous": "Previous",
    "save_draft": "Save Draft",
    "submit": "Submit Application",
    "of": "of"
  },
  "personal": {
    "title": "Personal Information",
    "subtitle": "Please fill in your personal details accurately",
    "first_name": "First Name",
    "last_name": "Last Name",
    "date_of_birth": "Date of Birth",
    "place_of_birth": "Place of Birth",
    "gender": "Gender",
    "male": "Male",
    "female": "Female",
    "nationality": "Nationality",
    "national_id": "National ID / Passport Number",
    "email": "Email Address",
    "phone": "Phone Number",
    "whatsapp": "WhatsApp Number",
    "address": "Residential Address",
    "city": "City",
    "region": "Region",
    "country": "Country",
    "marital_status": "Marital Status",
    "single": "Single",
    "married": "Married",
    "religion": "Religion",
    "photo": "Passport Photo",
    "photo_hint": "Upload a recent passport-size photo (JPEG/PNG, max 2MB)"
  },
  "academic": {
    "title": "Academic Background",
    "subtitle": "Provide your previous educational qualifications",
    "highest_qualification": "Highest Qualification",
    "institution": "Institution Attended",
    "graduation_year": "Year of Graduation",
    "gpa": "GPA / Average Grade",
    "certificate": "Certificate / Diploma",
    "o_level": "GCE Ordinary Level (O/L)",
    "a_level": "GCE Advanced Level (A/L)",
    "bacc": "Baccalauréat",
    "hnd_cert": "HND Certificate",
    "degree": "University Degree",
    "add_qualification": "Add Another Qualification",
    "subjects": "Subjects Passed",
    "grade": "Grade",
    "professional_exp": "Professional Experience",
    "has_experience": "Do you have any professional experience?",
    "exp_years": "Years of Experience",
    "exp_description": "Describe your experience",
    "specialization": "Field of Specialization",
    "transcript": "Upload Transcript",
    "transcript_hint": "Upload your academic transcript (PDF, max 5MB)"
  },
  "programme": {
    "title": "Programme Selection",
    "subtitle": "Choose your preferred programme and specialization",
    "system": "Academic System",
    "anglophone": "Anglophone System",
    "francophone": "Francophone System",
    "programme": "Select Programme",
    "department": "Department / Field",
    "specialization": "Specialization",
    "study_mode": "Mode of Study",
    "full_time": "Full-Time",
    "part_time": "Part-Time",
    "distance": "Distance Learning",
    "intake": "Intake Session",
    "campus": "Campus",
    "academic_year": "Academic Year",
    "second_choice": "Second Choice Programme (Optional)",
    "why_ztf": "Why did you choose ZTF University Institute?",
    "goals": "Career Goals",
    "referral": "How did you hear about us?",
    "social_media": "Social Media",
    "friend": "Friend/Family",
    "school": "Secondary School",
    "website": "Website",
    "other": "Other"
  },
  "documents": {
    "title": "Document Upload",
    "subtitle": "Upload all required documents. Accepted formats: PDF, JPEG, PNG, Excel",
    "required": "Required Documents",
    "optional": "Optional Documents",
    "birth_certificate": "Birth Certificate",
    "id_card": "National ID Card",
    "previous_certificates": "Previous Academic Certificates",
    "transcript": "Academic Transcript",
    "recommendation": "Letter of Recommendation",
    "medical": "Medical Certificate",
    "passport_photo": "Passport Photograph (x4)",
    "payment_proof": "Proof of Registration Fee Payment",
    "cv": "Curriculum Vitae (CV)",
    "supporting": "Other Supporting Documents",
    "upload_hint": "Drag and drop files here, or click to browse",
    "max_size": "Maximum file size: 10MB per file",
    "formats": "Accepted: PDF, JPG, PNG, XLSX",
    "uploaded": "Uploaded",
    "remove": "Remove",
    "uploading": "Uploading..."
  },
  "guardian": {
    "title": "Guardian & Emergency Contact",
    "subtitle": "Provide details of your parent/guardian and emergency contact",
    "parent_title": "Parent / Guardian Information",
    "parent_name": "Full Name",
    "parent_relationship": "Relationship",
    "parent_phone": "Phone Number",
    "parent_email": "Email Address",
    "parent_address": "Address",
    "parent_occupation": "Occupation",
    "parent_employer": "Employer",
    "emergency_title": "Emergency Contact",
    "emergency_name": "Full Name",
    "emergency_relationship": "Relationship",
    "emergency_phone": "Phone Number (Primary)",
    "emergency_phone2": "Phone Number (Secondary)",
    "sponsor_title": "Sponsorship / Financial Support",
    "sponsor_type": "Who will finance your studies?",
    "self": "Self-funded",
    "parent_sponsor": "Parent/Guardian",
    "scholarship": "Scholarship",
    "employer_sponsor": "Employer",
    "loan": "Student Loan",
    "sponsor_name": "Sponsor Name",
    "sponsor_contact": "Sponsor Contact"
  },
  "review": {
    "title": "Review & Submit",
    "subtitle": "Please carefully review all your information before submitting",
    "personal_section": "Personal Information",
    "academic_section": "Academic Background",
    "programme_section": "Programme Selection",
    "documents_section": "Documents",
    "guardian_section": "Guardian Information",
    "edit": "Edit",
    "declaration": "Declaration",
    "declaration_text": "I hereby declare that all the information provided in this application is true, complete, and accurate to the best of my knowledge. I understand that any false information may result in the cancellation of my admission.",
    "agree": "I agree to the above declaration",
    "terms": "I have read and agree to the Terms and Conditions",
    "submit_application": "Submit Application",
    "submitting": "Submitting...",
    "success_title": "Application Submitted Successfully!",
    "success_message": "Your application has been received. Your application number is:",
    "success_email": "A confirmation email has been sent to your email address.",
    "success_next": "What happens next?",
    "success_step1": "Our admissions team will review your application within 5-7 business days.",
    "success_step2": "You will receive an email notification about your application status.",
    "success_step3": "If shortlisted, you will be invited for an entrance examination or interview.",
    "download_receipt": "Download Application Receipt"
  },
  "status": {
    "title": "Check Application Status",
    "subtitle": "Enter your application number or email to check your status",
    "app_number": "Application Number",
    "email": "Email Address",
    "check": "Check Status",
    "pending": "Pending Review",
    "under_review": "Under Review",
    "shortlisted": "Shortlisted",
    "admitted": "Admitted",
    "rejected": "Not Successful",
    "deferred": "Deferred",
    "not_found": "Application not found"
  },
  "admin": {
    "title": "Admin Management System",
    "dashboard": "Dashboard",
    "applications": "Applications",
    "students": "Students",
    "documents": "Documents",
    "reports": "Reports",
    "settings": "Settings",
    "logout": "Logout",
    "total_applications": "Total Applications",
    "pending": "Pending",
    "admitted": "Admitted",
    "rejected": "Rejected",
    "by_programme": "By Programme",
    "by_status": "By Status",
    "recent_applications": "Recent Applications",
    "search": "Search applications...",
    "filter_status": "Filter by Status",
    "filter_programme": "Filter by Programme",
    "export_excel": "Export to Excel",
    "export_pdf": "Export PDF Report",
    "view": "View",
    "approve": "Admit",
    "reject": "Reject",
    "shortlist": "Shortlist",
    "defer": "Defer",
    "send_email": "Send Email",
    "download_docs": "Download Documents",
    "application_detail": "Application Details",
    "all_statuses": "All Statuses",
    "all_programmes": "All Programmes",
    "date_from": "Date From",
    "date_to": "Date To",
    "bulk_actions": "Bulk Actions",
    "select_all": "Select All",
    "print": "Print",
    "notes": "Admin Notes",
    "add_note": "Add Note",
    "history": "Application History",
    "login_title": "Admin Login",
    "email": "Email",
    "password": "Password",
    "login": "Login",
    "wrong_credentials": "Invalid email or password"
  },
  "validation": {
    "required": "This field is required",
    "email_invalid": "Please enter a valid email address",
    "phone_invalid": "Please enter a valid phone number",
    "min_length": "Must be at least {min} characters",
    "max_length": "Cannot exceed {max} characters",
    "file_too_large": "File size exceeds the maximum allowed ({max}MB)",
    "file_type_invalid": "File type not accepted. Please upload PDF, JPG, PNG, or XLSX",
    "date_invalid": "Please enter a valid date",
    "future_date": "Date cannot be in the future",
    "agree_required": "You must agree to the declaration to submit"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred. Please try again.",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm",
    "yes": "Yes",
    "no": "No",
    "close": "Close",
    "back": "Back",
    "continue": "Continue",
    "download": "Download",
    "print": "Print",
    "search": "Search",
    "filter": "Filter",
    "clear": "Clear",
    "apply": "Apply",
    "of": "of",
    "page": "Page",
    "rows_per_page": "Rows per page",
    "no_data": "No data available",
    "copyright": "© 2025 ZTF University Institute. All rights reserved."
  }
}
```

### File: `src/messages/fr.json` — COMPLETE FRENCH TRANSLATIONS
```json
{
  "nav": {
    "home": "Accueil",
    "register": "S'inscrire",
    "login": "Connexion Admin",
    "back_to_main": "Retour à ZTF Université",
    "language": "English"
  },
  "home": {
    "title": "Institut Universitaire ZTF",
    "subtitle": "Portail d'Inscription en Ligne",
    "description": "Commencez votre parcours académique à l'Institut Universitaire ZTF. Complétez votre inscription en ligne en quelques étapes.",
    "start_registration": "Commencer l'inscription",
    "check_status": "Vérifier le statut de ma candidature",
    "programmes": "Nos Filières",
    "anglophone_programmes": "Filières Anglophones",
    "francophone_programmes": "Filières Francophones",
    "hnd": "Diplôme National Supérieur (HND)",
    "btech": "Licence de Technologie (BTech)",
    "mtech": "Master de Technologie (MTech)",
    "bts": "Brevet de Technicien Supérieur (BTS)",
    "licence": "Licence Professionnelle",
    "master": "Master Professionnel",
    "requirements": "Conditions d'admission",
    "contact": "Contacter les admissions",
    "steps_title": "Inscription en 6 Étapes Simples",
    "step1": "Informations Personnelles",
    "step2": "Parcours Académique",
    "step3": "Choix de Filière",
    "step4": "Téléversement de Documents",
    "step5": "Infos Tuteur et Urgence",
    "step6": "Révision et Soumission"
  },
  "steps": {
    "step1_title": "Informations Personnelles",
    "step2_title": "Parcours Académique",
    "step3_title": "Choix de Filière",
    "step4_title": "Téléversement de Documents",
    "step5_title": "Tuteur et Contact d'Urgence",
    "step6_title": "Révision et Soumission",
    "next": "Étape Suivante",
    "previous": "Précédent",
    "save_draft": "Enregistrer le brouillon",
    "submit": "Soumettre la candidature",
    "of": "sur"
  },
  "personal": {
    "title": "Informations Personnelles",
    "subtitle": "Veuillez renseigner vos informations personnelles avec précision",
    "first_name": "Prénom",
    "last_name": "Nom de Famille",
    "date_of_birth": "Date de Naissance",
    "place_of_birth": "Lieu de Naissance",
    "gender": "Sexe",
    "male": "Masculin",
    "female": "Féminin",
    "nationality": "Nationalité",
    "national_id": "CNI / Numéro de Passeport",
    "email": "Adresse Email",
    "phone": "Numéro de Téléphone",
    "whatsapp": "Numéro WhatsApp",
    "address": "Adresse Résidentielle",
    "city": "Ville",
    "region": "Région",
    "country": "Pays",
    "marital_status": "Situation Matrimoniale",
    "single": "Célibataire",
    "married": "Marié(e)",
    "religion": "Religion",
    "photo": "Photo d'Identité",
    "photo_hint": "Téléversez une photo récente format passeport (JPEG/PNG, max 2Mo)"
  },
  "academic": {
    "title": "Parcours Académique",
    "subtitle": "Indiquez vos diplômes et qualifications antérieurs",
    "highest_qualification": "Diplôme le Plus Élevé",
    "institution": "Établissement Fréquenté",
    "graduation_year": "Année d'Obtention",
    "gpa": "Moyenne Générale",
    "certificate": "Certificat / Diplôme",
    "o_level": "BEPC",
    "a_level": "GCE Advanced Level (A/L)",
    "bacc": "Baccalauréat",
    "hnd_cert": "HND",
    "degree": "Licence / Diplôme Universitaire",
    "add_qualification": "Ajouter un Diplôme",
    "subjects": "Matières Obtenues",
    "grade": "Note",
    "professional_exp": "Expérience Professionnelle",
    "has_experience": "Avez-vous une expérience professionnelle ?",
    "exp_years": "Nombre d'Années",
    "exp_description": "Décrivez votre expérience",
    "specialization": "Domaine de Spécialisation",
    "transcript": "Téléverser le Relevé de Notes",
    "transcript_hint": "Téléversez votre relevé de notes (PDF, max 5Mo)"
  },
  "programme": {
    "title": "Choix de Filière",
    "subtitle": "Choisissez votre filière et spécialisation",
    "system": "Système d'Enseignement",
    "anglophone": "Système Anglophone",
    "francophone": "Système Francophone",
    "programme": "Choisir une Filière",
    "department": "Département / Domaine",
    "specialization": "Spécialisation",
    "study_mode": "Mode d'Étude",
    "full_time": "Présentiel",
    "part_time": "Temps Partiel",
    "distance": "Enseignement à Distance",
    "intake": "Session d'Entrée",
    "campus": "Campus",
    "academic_year": "Année Académique",
    "second_choice": "Deuxième Choix (Optionnel)",
    "why_ztf": "Pourquoi avez-vous choisi l'IU ZTF ?",
    "goals": "Objectifs Professionnels",
    "referral": "Comment avez-vous entendu parler de nous ?",
    "social_media": "Réseaux Sociaux",
    "friend": "Ami/Famille",
    "school": "Lycée",
    "website": "Site Web",
    "other": "Autre"
  },
  "documents": {
    "title": "Téléversement de Documents",
    "subtitle": "Téléversez tous les documents requis. Formats acceptés : PDF, JPEG, PNG, Excel",
    "required": "Documents Obligatoires",
    "optional": "Documents Optionnels",
    "birth_certificate": "Acte de Naissance",
    "id_card": "Carte Nationale d'Identité",
    "previous_certificates": "Diplômes Antérieurs",
    "transcript": "Relevé de Notes",
    "recommendation": "Lettre de Recommandation",
    "medical": "Certificat Médical",
    "passport_photo": "Photos d'Identité (x4)",
    "payment_proof": "Reçu de Paiement des Frais d'Inscription",
    "cv": "Curriculum Vitae (CV)",
    "supporting": "Autres Documents Justificatifs",
    "upload_hint": "Glissez-déposez vos fichiers ici, ou cliquez pour parcourir",
    "max_size": "Taille maximale : 10Mo par fichier",
    "formats": "Acceptés : PDF, JPG, PNG, XLSX",
    "uploaded": "Téléversé",
    "remove": "Supprimer",
    "uploading": "Téléversement en cours..."
  },
  "guardian": {
    "title": "Tuteur et Contact d'Urgence",
    "subtitle": "Fournissez les informations de votre parent/tuteur et contact d'urgence",
    "parent_title": "Informations du Parent / Tuteur",
    "parent_name": "Nom Complet",
    "parent_relationship": "Lien de Parenté",
    "parent_phone": "Numéro de Téléphone",
    "parent_email": "Adresse Email",
    "parent_address": "Adresse",
    "parent_occupation": "Profession",
    "parent_employer": "Employeur",
    "emergency_title": "Contact d'Urgence",
    "emergency_name": "Nom Complet",
    "emergency_relationship": "Lien de Parenté",
    "emergency_phone": "Téléphone Principal",
    "emergency_phone2": "Téléphone Secondaire",
    "sponsor_title": "Financement des Études",
    "sponsor_type": "Qui financera vos études ?",
    "self": "Autofinancement",
    "parent_sponsor": "Parent/Tuteur",
    "scholarship": "Bourse d'Étude",
    "employer_sponsor": "Employeur",
    "loan": "Prêt Étudiant",
    "sponsor_name": "Nom du Sponsor",
    "sponsor_contact": "Contact du Sponsor"
  },
  "review": {
    "title": "Révision et Soumission",
    "subtitle": "Veuillez vérifier attentivement toutes vos informations avant de soumettre",
    "personal_section": "Informations Personnelles",
    "academic_section": "Parcours Académique",
    "programme_section": "Choix de Filière",
    "documents_section": "Documents",
    "guardian_section": "Informations du Tuteur",
    "edit": "Modifier",
    "declaration": "Déclaration",
    "declaration_text": "Je déclare que toutes les informations fournies dans cette candidature sont vraies, complètes et exactes à ma connaissance. Je comprends que toute fausse déclaration pourra entraîner l'annulation de mon admission.",
    "agree": "J'accepte la déclaration ci-dessus",
    "terms": "J'ai lu et j'accepte les Conditions Générales",
    "submit_application": "Soumettre la Candidature",
    "submitting": "Soumission en cours...",
    "success_title": "Candidature Soumise avec Succès !",
    "success_message": "Votre candidature a été reçue. Votre numéro de candidature est :",
    "success_email": "Un email de confirmation a été envoyé à votre adresse email.",
    "success_next": "Quelle est la suite ?",
    "success_step1": "Notre équipe des admissions examinera votre candidature dans un délai de 5 à 7 jours ouvrables.",
    "success_step2": "Vous recevrez une notification par email concernant le statut de votre candidature.",
    "success_step3": "Si vous êtes présélectionné, vous serez convoqué pour un examen d'entrée ou un entretien.",
    "download_receipt": "Télécharger l'Accusé de Réception"
  },
  "status": {
    "title": "Vérifier le Statut de ma Candidature",
    "subtitle": "Entrez votre numéro de candidature ou votre email",
    "app_number": "Numéro de Candidature",
    "email": "Adresse Email",
    "check": "Vérifier",
    "pending": "En Attente",
    "under_review": "En Cours d'Examen",
    "shortlisted": "Présélectionné",
    "admitted": "Admis",
    "rejected": "Non Retenu",
    "deferred": "Reporté",
    "not_found": "Candidature introuvable"
  },
  "admin": {
    "title": "Système de Gestion Admin",
    "dashboard": "Tableau de Bord",
    "applications": "Candidatures",
    "students": "Étudiants",
    "documents": "Documents",
    "reports": "Rapports",
    "settings": "Paramètres",
    "logout": "Déconnexion",
    "total_applications": "Total des Candidatures",
    "pending": "En Attente",
    "admitted": "Admis",
    "rejected": "Non Retenus",
    "by_programme": "Par Filière",
    "by_status": "Par Statut",
    "recent_applications": "Candidatures Récentes",
    "search": "Rechercher des candidatures...",
    "filter_status": "Filtrer par Statut",
    "filter_programme": "Filtrer par Filière",
    "export_excel": "Exporter en Excel",
    "export_pdf": "Exporter en PDF",
    "view": "Voir",
    "approve": "Admettre",
    "reject": "Rejeter",
    "shortlist": "Présélectionner",
    "defer": "Reporter",
    "send_email": "Envoyer Email",
    "download_docs": "Télécharger Documents",
    "application_detail": "Détails de la Candidature",
    "all_statuses": "Tous les Statuts",
    "all_programmes": "Toutes les Filières",
    "date_from": "Date de Début",
    "date_to": "Date de Fin",
    "bulk_actions": "Actions Groupées",
    "select_all": "Tout Sélectionner",
    "print": "Imprimer",
    "notes": "Notes Admin",
    "add_note": "Ajouter une Note",
    "history": "Historique",
    "login_title": "Connexion Admin",
    "email": "Email",
    "password": "Mot de Passe",
    "login": "Se Connecter",
    "wrong_credentials": "Email ou mot de passe incorrect"
  },
  "validation": {
    "required": "Ce champ est obligatoire",
    "email_invalid": "Veuillez entrer une adresse email valide",
    "phone_invalid": "Veuillez entrer un numéro de téléphone valide",
    "min_length": "Doit contenir au moins {min} caractères",
    "max_length": "Ne peut pas dépasser {max} caractères",
    "file_too_large": "La taille du fichier dépasse le maximum autorisé ({max}Mo)",
    "file_type_invalid": "Type de fichier non accepté. Veuillez téléverser PDF, JPG, PNG ou XLSX",
    "date_invalid": "Veuillez entrer une date valide",
    "future_date": "La date ne peut pas être dans le futur",
    "agree_required": "Vous devez accepter la déclaration pour soumettre"
  },
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur s'est produite. Veuillez réessayer.",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "confirm": "Confirmer",
    "yes": "Oui",
    "no": "Non",
    "close": "Fermer",
    "back": "Retour",
    "continue": "Continuer",
    "download": "Télécharger",
    "print": "Imprimer",
    "search": "Rechercher",
    "filter": "Filtrer",
    "clear": "Effacer",
    "apply": "Appliquer",
    "of": "sur",
    "page": "Page",
    "rows_per_page": "Lignes par page",
    "no_data": "Aucune donnée disponible",
    "copyright": "© 2025 Institut Universitaire ZTF. Tous droits réservés."
  }
}
```

---

## 🗄 SUPABASE DATABASE SCHEMA

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- APPLICATIONS TABLE (main registration table)
-- =============================================
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending', 'under_review', 'shortlisted', 'admitted', 'rejected', 'deferred', 'withdrawn'
  )),
  language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'fr')),
  academic_system VARCHAR(15) CHECK (academic_system IN ('anglophone', 'francophone')),
  programme VARCHAR(20) CHECK (programme IN ('HND', 'BTech', 'MTech', 'BTS', 'Licence', 'Master')),
  department VARCHAR(100),
  specialization VARCHAR(100),
  study_mode VARCHAR(20) DEFAULT 'full_time',
  intake_session VARCHAR(50),
  academic_year VARCHAR(20),
  second_choice_programme VARCHAR(20),
  why_ztf TEXT,
  career_goals TEXT,
  referral_source VARCHAR(50),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_draft BOOLEAN DEFAULT true,
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- =============================================
-- PERSONAL INFO TABLE
-- =============================================
CREATE TABLE personal_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  place_of_birth VARCHAR(100),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  nationality VARCHAR(100),
  national_id VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Cameroon',
  marital_status VARCHAR(20),
  religion VARCHAR(50),
  passport_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACADEMIC BACKGROUND TABLE
-- =============================================
CREATE TABLE academic_qualifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  qualification_type VARCHAR(50) NOT NULL,
  institution_name VARCHAR(200) NOT NULL,
  graduation_year INTEGER,
  gpa_grade VARCHAR(20),
  subjects JSONB DEFAULT '[]',
  certificate_url TEXT,
  is_highest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE professional_experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  has_experience BOOLEAN DEFAULT false,
  years_of_experience INTEGER,
  description TEXT,
  field_of_specialization VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOCUMENTS TABLE
-- =============================================
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_required BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GUARDIAN & EMERGENCY CONTACTS TABLE
-- =============================================
CREATE TABLE guardian_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  guardian_full_name VARCHAR(200) NOT NULL,
  guardian_relationship VARCHAR(50),
  guardian_phone VARCHAR(20),
  guardian_email VARCHAR(255),
  guardian_address TEXT,
  guardian_occupation VARCHAR(100),
  guardian_employer VARCHAR(200),
  emergency_full_name VARCHAR(200),
  emergency_relationship VARCHAR(50),
  emergency_phone VARCHAR(20),
  emergency_phone2 VARCHAR(20),
  sponsor_type VARCHAR(50),
  sponsor_name VARCHAR(200),
  sponsor_contact VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- APPLICATION STATUS HISTORY TABLE
-- =============================================
CREATE TABLE application_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status_from VARCHAR(30),
  status_to VARCHAR(30) NOT NULL,
  changed_by UUID,
  changed_by_email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200),
  role VARCHAR(20) DEFAULT 'reviewer' CHECK (role IN ('super_admin', 'admin', 'reviewer')),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DRAFT SAVES TABLE (auto-save progress)
-- =============================================
CREATE TABLE registration_drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_token VARCHAR(100) UNIQUE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  step_data JSONB DEFAULT '{}',
  current_step INTEGER DEFAULT 1,
  last_saved TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- =============================================
-- EMAIL NOTIFICATIONS LOG
-- =============================================
CREATE TABLE email_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255),
  email_type VARCHAR(50),
  subject VARCHAR(255),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_programme ON applications(programme);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_number ON applications(application_number);
CREATE INDEX idx_personal_info_email ON personal_info(email);
CREATE INDEX idx_personal_info_app_id ON personal_info(application_id);
CREATE INDEX idx_documents_app_id ON documents(application_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_drafts_token ON registration_drafts(session_token);

-- =============================================
-- FUNCTION: Auto-generate application number
-- =============================================
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part VARCHAR(4);
  seq_num INTEGER;
  new_number VARCHAR(20);
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num 
  FROM applications 
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  new_number := 'ZTF-' || year_part || '-' || LPAD(seq_num::TEXT, 5, '0');
  NEW.application_number := new_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_app_number
BEFORE INSERT ON applications
FOR EACH ROW
WHEN (NEW.application_number IS NULL OR NEW.application_number = '')
EXECUTE FUNCTION generate_application_number();

-- =============================================
-- FUNCTION: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_applications
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can insert (for registration)
CREATE POLICY "Allow public insert" ON applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON personal_info FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON academic_qualifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON professional_experience FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON documents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON guardian_info FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON registration_drafts FOR ALL TO anon USING (true) WITH CHECK (true);

-- Public can read their own application by application_number
CREATE POLICY "Allow public status check" ON applications FOR SELECT TO anon
  USING (true); -- controlled by application_number in API

-- Admins can do everything
CREATE POLICY "Admin full access" ON applications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON personal_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON academic_qualifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON professional_experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON guardian_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON application_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 📦 SUPABASE STORAGE SETUP

In Supabase dashboard, create these storage buckets:
1. `student-documents` — public: false
2. `passport-photos` — public: true

Add these storage policies:
```sql
-- Allow public uploads to student-documents
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id IN ('student-documents', 'passport-photos'));

-- Allow admin to view/download
CREATE POLICY "Admin can view documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id IN ('student-documents', 'passport-photos'));
```

---

## 📂 COMPLETE FILE STRUCTURE

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                    # Locale layout with i18n provider
│   │   ├── page.tsx                      # Home/landing page
│   │   ├── register/
│   │   │   ├── page.tsx                  # Registration entry (redirects to step 1)
│   │   │   └── [step]/
│   │   │       └── page.tsx              # Dynamic step pages (1-6)
│   │   ├── status/
│   │   │   └── page.tsx                  # Check application status
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── (dashboard)/
│   │           ├── layout.tsx            # Admin layout with sidebar
│   │           ├── page.tsx              # Dashboard
│   │           ├── applications/
│   │           │   ├── page.tsx          # Applications list
│   │           │   └── [id]/
│   │           │       └── page.tsx      # Single application detail
│   │           ├── documents/
│   │           │   └── page.tsx
│   │           └── reports/
│   │               └── page.tsx
│   └── api/
│       ├── registration/
│       │   ├── start/route.ts            # Start/init registration
│       │   ├── save-draft/route.ts       # Auto-save draft
│       │   ├── upload/route.ts           # File upload
│       │   └── submit/route.ts           # Final submission
│       ├── status/route.ts               # Public status check
│       └── admin/
│           ├── applications/route.ts
│           ├── applications/[id]/route.ts
│           ├── applications/[id]/status/route.ts
│           └── export/route.ts
├── components/
│   ├── ui/                               # shadcn components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── registration/
│   │   ├── RegistrationLayout.tsx        # Stepper wrapper
│   │   ├── StepIndicator.tsx             # Step progress bar
│   │   ├── LanguageSwitcher.tsx
│   │   ├── steps/
│   │   │   ├── Step1Personal.tsx
│   │   │   ├── Step2Academic.tsx
│   │   │   ├── Step3Programme.tsx
│   │   │   ├── Step4Documents.tsx
│   │   │   ├── Step5Guardian.tsx
│   │   │   └── Step6Review.tsx
│   │   ├── FileUploader.tsx              # Drag-and-drop uploader
│   │   └── SuccessPage.tsx
│   └── admin/
│       ├── DashboardStats.tsx
│       ├── ApplicationsTable.tsx
│       ├── ApplicationDetail.tsx
│       ├── StatusBadge.tsx
│       ├── DocumentViewer.tsx
│       └── ExportButtons.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser client
│   │   └── server.ts                     # Server client
│   ├── validations/
│   │   ├── step1.ts
│   │   ├── step2.ts
│   │   ├── step3.ts
│   │   ├── step4.ts
│   │   ├── step5.ts
│   │   └── step6.ts
│   ├── constants/
│   │   ├── programmes.ts                 # Programme/department data
│   │   └── documents.ts                  # Required documents per programme
│   ├── utils/
│   │   ├── export.ts                     # Excel/PDF export
│   │   ├── email.ts                      # Email templates
│   │   └── helpers.ts
│   └── store/
│       └── registrationStore.ts          # Zustand store for form state
├── messages/
│   ├── en.json
│   └── fr.json
├── types/
│   └── index.ts                          # All TypeScript types
├── i18n.ts
└── middleware.ts
```

---

## 🔑 ENVIRONMENT VARIABLES

### File: `.env.local`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=https://register.ztfuniversity.com
NEXT_PUBLIC_MAIN_SITE_URL=https://www.ztfuniversity.com

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=admissions@ztfuniversity.com

# Admin
ADMIN_SECRET_KEY=your_secret_admin_key
```

---

## 🏗 BUILD INSTRUCTIONS FOR CLAUDE CODE

### STEP 1 — Types & Constants

**File: `src/types/index.ts`**
Define all TypeScript interfaces:
```typescript
export interface Application {
  id: string;
  application_number: string;
  status: ApplicationStatus;
  language: 'en' | 'fr';
  academic_system: 'anglophone' | 'francophone';
  programme: Programme;
  department: string;
  specialization: string;
  study_mode: StudyMode;
  intake_session: string;
  academic_year: string;
  submitted_at: string | null;
  created_at: string;
  is_draft: boolean;
}

export type ApplicationStatus = 'pending' | 'under_review' | 'shortlisted' | 'admitted' | 'rejected' | 'deferred' | 'withdrawn';
export type Programme = 'HND' | 'BTech' | 'MTech' | 'BTS' | 'Licence' | 'Master';
export type StudyMode = 'full_time' | 'part_time' | 'distance';

export interface PersonalInfo {
  application_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  national_id: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  region: string;
  country: string;
  marital_status: string;
  religion: string;
  passport_photo_url: string | null;
}

export interface AcademicQualification {
  id?: string;
  application_id: string;
  qualification_type: string;
  institution_name: string;
  graduation_year: number;
  gpa_grade: string;
  subjects: { name: string; grade: string }[];
  certificate_url: string | null;
  is_highest: boolean;
}

export interface GuardianInfo {
  application_id: string;
  guardian_full_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  guardian_email: string;
  guardian_address: string;
  guardian_occupation: string;
  guardian_employer: string;
  emergency_full_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  emergency_phone2: string;
  sponsor_type: string;
  sponsor_name: string;
  sponsor_contact: string;
}

export interface Document {
  id: string;
  application_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_required: boolean;
  is_verified: boolean;
}

export interface RegistrationFormData {
  step1: Partial<PersonalInfo>;
  step2: {
    qualifications: Partial<AcademicQualification>[];
    experience: Partial<{
      has_experience: boolean;
      years_of_experience: number;
      description: string;
      field_of_specialization: string;
    }>;
  };
  step3: Partial<Pick<Application, 'academic_system' | 'programme' | 'department' | 'specialization' | 'study_mode' | 'intake_session' | 'academic_year' | 'second_choice_programme' | 'why_ztf' | 'career_goals' | 'referral_source'>>;
  step4: { documents: Partial<Document>[] };
  step5: Partial<GuardianInfo>;
}

export interface AdminUser {
  id: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'reviewer';
  department: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  under_review: number;
  shortlisted: number;
  admitted: number;
  rejected: number;
  by_programme: Record<Programme, number>;
  this_month: number;
}
```

**File: `src/lib/constants/programmes.ts`**
```typescript
export const ANGLOPHONE_PROGRAMMES = {
  HND: {
    label: 'Higher National Diploma (HND)',
    departments: [
      'Computer Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Business Management',
      'Accounting & Finance',
      'Marketing',
      'Agriculture',
      'Public Health',
      'Journalism & Communication',
    ]
  },
  BTech: {
    label: 'Bachelor of Technology (BTech)',
    departments: [
      'Software Engineering',
      'Network & Cybersecurity',
      'Data Science & AI',
      'Civil & Construction Engineering',
      'Electrical & Electronics Engineering',
      'Business Administration',
      'Accounting',
      'Finance & Banking',
    ]
  },
  MTech: {
    label: 'Master of Technology (MTech)',
    departments: [
      'Information Technology',
      'Project Management',
      'Finance & Investment',
      'Public Administration',
      'Environmental Engineering',
    ]
  }
};

export const FRANCOPHONE_PROGRAMMES = {
  BTS: {
    label: 'Brevet de Technicien Supérieur (BTS)',
    departments: [
      'Informatique',
      'Génie Civil',
      'Électrotechnique',
      'Comptabilité & Gestion',
      'Commerce',
      'Secrétariat',
      'Agriculture',
      'Santé Publique',
    ]
  },
  Licence: {
    label: 'Licence Professionnelle',
    departments: [
      'Génie Logiciel',
      'Réseaux & Télécommunications',
      'Gestion des Entreprises',
      'Finance & Comptabilité',
      'Marketing & Commerce',
      'Droit des Affaires',
    ]
  },
  Master: {
    label: 'Master Professionnel',
    departments: [
      'Technologies de l\'Information',
      'Gestion de Projets',
      'Finance & Investissement',
      'Administration Publique',
    ]
  }
};

export const INTAKE_SESSIONS = ['September 2025', 'January 2026', 'September 2026'];
export const ACADEMIC_YEARS = ['2025-2026', '2026-2027'];

export const CAMEROON_REGIONS = [
  'Adamaoua', 'Centre', 'East', 'Far North', 'Littoral',
  'North', 'North-West', 'South', 'South-West', 'West'
];
```

**File: `src/lib/constants/documents.ts`**
```typescript
export interface DocumentRequirement {
  type: string;
  labelEn: string;
  labelFr: string;
  required: boolean;
  maxSizeMB: number;
  acceptedTypes: string[];
}

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    type: 'birth_certificate',
    labelEn: 'Birth Certificate',
    labelFr: 'Acte de Naissance',
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'national_id',
    labelEn: 'National ID Card / Passport',
    labelFr: 'Carte Nationale d\'Identité / Passeport',
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'academic_certificates',
    labelEn: 'Academic Certificates (O/L, A/L, BAC, etc.)',
    labelFr: 'Diplômes Académiques (BEPC, BAC, etc.)',
    required: true,
    maxSizeMB: 10,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'transcript',
    labelEn: 'Academic Transcript / Relevé de Notes',
    labelFr: 'Relevé de Notes',
    required: true,
    maxSizeMB: 10,
    acceptedTypes: ['application/pdf'],
  },
  {
    type: 'passport_photos',
    labelEn: 'Passport Photos (4 copies)',
    labelFr: 'Photos d\'Identité (4 exemplaires)',
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['image/jpeg', 'image/png'],
  },
  {
    type: 'payment_proof',
    labelEn: 'Proof of Registration Fee Payment',
    labelFr: 'Reçu de Paiement des Frais d\'Inscription',
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'recommendation_letter',
    labelEn: 'Letter of Recommendation',
    labelFr: 'Lettre de Recommandation',
    required: false,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf'],
  },
  {
    type: 'medical_certificate',
    labelEn: 'Medical Certificate',
    labelFr: 'Certificat Médical',
    required: false,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg'],
  },
  {
    type: 'cv',
    labelEn: 'Curriculum Vitae (CV)',
    labelFr: 'Curriculum Vitae (CV)',
    required: false,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  {
    type: 'supporting_documents',
    labelEn: 'Other Supporting Documents',
    labelFr: 'Autres Pièces Justificatives',
    required: false,
    maxSizeMB: 10,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
];
```

---

### STEP 2 — Supabase Client Setup

**File: `src/lib/supabase/client.ts`**
```typescript
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**File: `src/lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );
};

export const createAdminSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );
};
```

---

### STEP 3 — Registration Store (Zustand)

**File: `src/lib/store/registrationStore.ts`**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RegistrationFormData } from '@/types';

interface RegistrationState {
  currentStep: number;
  applicationId: string | null;
  sessionToken: string | null;
  formData: RegistrationFormData;
  isSubmitting: boolean;
  setCurrentStep: (step: number) => void;
  setApplicationId: (id: string) => void;
  setSessionToken: (token: string) => void;
  updateStep1: (data: Partial<RegistrationFormData['step1']>) => void;
  updateStep2: (data: Partial<RegistrationFormData['step2']>) => void;
  updateStep3: (data: Partial<RegistrationFormData['step3']>) => void;
  updateStep4: (data: Partial<RegistrationFormData['step4']>) => void;
  updateStep5: (data: Partial<RegistrationFormData['step5']>) => void;
  setIsSubmitting: (val: boolean) => void;
  resetForm: () => void;
}

const initialFormData: RegistrationFormData = {
  step1: {},
  step2: { qualifications: [{}], experience: {} },
  step3: {},
  step4: { documents: [] },
  step5: {},
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      currentStep: 1,
      applicationId: null,
      sessionToken: null,
      formData: initialFormData,
      isSubmitting: false,
      setCurrentStep: (step) => set({ currentStep: step }),
      setApplicationId: (id) => set({ applicationId: id }),
      setSessionToken: (token) => set({ sessionToken: token }),
      updateStep1: (data) => set((state) => ({
        formData: { ...state.formData, step1: { ...state.formData.step1, ...data } }
      })),
      updateStep2: (data) => set((state) => ({
        formData: { ...state.formData, step2: { ...state.formData.step2, ...data } }
      })),
      updateStep3: (data) => set((state) => ({
        formData: { ...state.formData, step3: { ...state.formData.step3, ...data } }
      })),
      updateStep4: (data) => set((state) => ({
        formData: { ...state.formData, step4: { ...state.formData.step4, ...data } }
      })),
      updateStep5: (data) => set((state) => ({
        formData: { ...state.formData, step5: { ...state.formData.step5, ...data } }
      })),
      setIsSubmitting: (val) => set({ isSubmitting: val }),
      resetForm: () => set({
        currentStep: 1,
        applicationId: null,
        sessionToken: null,
        formData: initialFormData,
        isSubmitting: false,
      }),
    }),
    { name: 'ztf-registration-store' }
  )
);
```

---

### STEP 4 — API ROUTES

**File: `src/app/api/registration/start/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const sessionToken = uuidv4();

    const { data: app, error } = await supabase
      .from('applications')
      .insert({ is_draft: true, language: 'en' })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('registration_drafts').insert({
      session_token: sessionToken,
      application_id: app.id,
      step_data: {},
      current_step: 1,
    });

    return NextResponse.json({ 
      success: true, 
      applicationId: app.id,
      applicationNumber: app.application_number,
      sessionToken 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**File: `src/app/api/registration/upload/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const applicationId = formData.get('applicationId') as string;
    const documentType = formData.get('documentType') as string;
    const isRequired = formData.get('isRequired') === 'true';

    if (!file || !applicationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicationId}/${documentType}_${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('student-documents')
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('student-documents')
      .getPublicUrl(fileName);

    const { data: doc, error: dbError } = await supabase
      .from('documents')
      .insert({
        application_id: applicationId,
        document_type: documentType,
        document_name: file.name,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        is_required: isRequired,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**File: `src/app/api/registration/submit/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { sendConfirmationEmail } from '@/lib/utils/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, formData } = body;
    const supabase = createAdminSupabaseClient();

    // 1. Save personal info
    const { error: personalError } = await supabase
      .from('personal_info')
      .upsert({ application_id: applicationId, ...formData.step1 });
    if (personalError) throw personalError;

    // 2. Save academic qualifications
    if (formData.step2?.qualifications?.length) {
      await supabase.from('academic_qualifications').delete().eq('application_id', applicationId);
      const quals = formData.step2.qualifications.map((q: any) => ({ ...q, application_id: applicationId }));
      const { error: qualError } = await supabase.from('academic_qualifications').insert(quals);
      if (qualError) throw qualError;
    }

    // 3. Save professional experience
    if (formData.step2?.experience) {
      const { error: expError } = await supabase
        .from('professional_experience')
        .upsert({ application_id: applicationId, ...formData.step2.experience });
      if (expError) throw expError;
    }

    // 4. Save guardian info
    if (formData.step5) {
      const { error: guardError } = await supabase
        .from('guardian_info')
        .upsert({ application_id: applicationId, ...formData.step5 });
      if (guardError) throw guardError;
    }

    // 5. Update application status
    const { data: app, error: appError } = await supabase
      .from('applications')
      .update({
        ...formData.step3,
        is_draft: false,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        language: formData.language || 'en',
      })
      .eq('id', applicationId)
      .select()
      .single();
    if (appError) throw appError;

    // 6. Log status change
    await supabase.from('application_history').insert({
      application_id: applicationId,
      status_from: null,
      status_to: 'pending',
      notes: 'Application submitted by student',
    });

    // 7. Send confirmation email
    if (formData.step1?.email) {
      await sendConfirmationEmail({
        to: formData.step1.email,
        firstName: formData.step1.first_name,
        applicationNumber: app.application_number,
        programme: app.programme,
        language: formData.language || 'en',
      });
    }

    return NextResponse.json({
      success: true,
      applicationNumber: app.application_number,
    });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**File: `src/app/api/status/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appNumber = searchParams.get('number');
    const email = searchParams.get('email');
    const supabase = createAdminSupabaseClient();

    let query = supabase
      .from('applications')
      .select(`
        id, application_number, status, programme, academic_system,
        submitted_at, created_at, department, specialization,
        personal_info(first_name, last_name, email)
      `)
      .eq('is_draft', false);

    if (appNumber) query = query.eq('application_number', appNumber);
    else if (email) query = query.eq('personal_info.email', email);
    else return NextResponse.json({ error: 'Provide application number or email' }, { status: 400 });

    const { data, error } = await query.single();
    if (error || !data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**File: `src/app/api/admin/applications/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const programme = searchParams.get('programme');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const from = (page - 1) * limit;

    let query = supabase
      .from('applications')
      .select(`
        id, application_number, status, programme, department,
        academic_system, submitted_at, created_at, language,
        personal_info(first_name, last_name, email, phone)
      `, { count: 'exact' })
      .eq('is_draft', false)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (status && status !== 'all') query = query.eq('status', status);
    if (programme && programme !== 'all') query = query.eq('programme', programme);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, applications: data, total: count, page, limit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**File: `src/app/api/admin/applications/[id]/status/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminSupabaseClient();
    const { status, notes, rejection_reason } = await req.json();

    const { data: current } = await supabase
      .from('applications')
      .select('status')
      .eq('id', params.id)
      .single();

    const { data: app, error } = await supabase
      .from('applications')
      .update({ status, admin_notes: notes, rejection_reason })
      .eq('id', params.id)
      .select()
      .single();
    if (error) throw error;

    await supabase.from('application_history').insert({
      application_id: params.id,
      status_from: current?.status,
      status_to: status,
      notes,
    });

    return NextResponse.json({ success: true, application: app });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**File: `src/app/api/admin/export/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'excel';
    const status = searchParams.get('status');
    const programme = searchParams.get('programme');

    let query = supabase
      .from('applications')
      .select(`
        application_number, status, programme, department, specialization,
        academic_system, study_mode, intake_session, academic_year,
        submitted_at, language,
        personal_info(first_name, last_name, email, phone, nationality, city, region),
        guardian_info(guardian_full_name, guardian_phone, guardian_relationship)
      `)
      .eq('is_draft', false)
      .order('submitted_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);
    if (programme && programme !== 'all') query = query.eq('programme', programme);

    const { data, error } = await query;
    if (error) throw error;

    const rows = data?.map((app: any) => ({
      'Application No.': app.application_number,
      'First Name': app.personal_info?.first_name,
      'Last Name': app.personal_info?.last_name,
      'Email': app.personal_info?.email,
      'Phone': app.personal_info?.phone,
      'Nationality': app.personal_info?.nationality,
      'City': app.personal_info?.city,
      'Region': app.personal_info?.region,
      'System': app.academic_system,
      'Programme': app.programme,
      'Department': app.department,
      'Specialization': app.specialization,
      'Mode': app.study_mode,
      'Intake': app.intake_session,
      'Academic Year': app.academic_year,
      'Language': app.language?.toUpperCase(),
      'Status': app.status,
      'Submitted': app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-',
      'Guardian': app.guardian_info?.guardian_full_name,
      'Guardian Phone': app.guardian_info?.guardian_phone,
    }));

    const ws = XLSX.utils.json_to_sheet(rows || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="ZTF_Applications_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

### STEP 5 — EMAIL UTILITY

**File: `src/lib/utils/email.ts`**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ConfirmationEmailParams {
  to: string;
  firstName: string;
  applicationNumber: string;
  programme: string;
  language: 'en' | 'fr';
}

export async function sendConfirmationEmail({ to, firstName, applicationNumber, programme, language }: ConfirmationEmailParams) {
  const isEn = language === 'en';

  const subject = isEn
    ? `Application Confirmed – ZTF University Institute [${applicationNumber}]`
    : `Candidature Confirmée – Institut Universitaire ZTF [${applicationNumber}]`;

  const html = isEn ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003B7A; padding: 30px; text-align: center;">
        <img src="https://www.ztfuniversity.com/logo.png" alt="ZTF University" style="height: 60px;" />
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #003B7A;">Dear ${firstName},</h2>
        <p>Thank you for applying to <strong>ZTF University Institute</strong>. Your application has been received successfully.</p>
        <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
          <p><strong>Application Number:</strong> ${applicationNumber}</p>
          <p><strong>Programme:</strong> ${programme}</p>
          <p><strong>Status:</strong> Pending Review</p>
        </div>
        <p>Our admissions team will review your application within <strong>5–7 business days</strong>.</p>
        <p>You can check your application status at: <a href="https://register.ztfuniversity.com/en/status">register.ztfuniversity.com/en/status</a></p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 14px;">ZTF University Institute | Bertoua, Cameroon<br/>Tel: +237 6XX XXX XXX | Email: admissions@ztfuniversity.com</p>
      </div>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003B7A; padding: 30px; text-align: center;">
        <img src="https://www.ztfuniversity.com/logo.png" alt="IU ZTF" style="height: 60px;" />
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #003B7A;">Cher(e) ${firstName},</h2>
        <p>Nous vous remercions d'avoir soumis votre candidature à l'<strong>Institut Universitaire ZTF</strong>. Votre dossier a bien été reçu.</p>
        <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
          <p><strong>Numéro de candidature :</strong> ${applicationNumber}</p>
          <p><strong>Filière :</strong> ${programme}</p>
          <p><strong>Statut :</strong> En attente d'examen</p>
        </div>
        <p>Notre équipe des admissions examinera votre dossier dans un délai de <strong>5 à 7 jours ouvrables</strong>.</p>
        <p>Vous pouvez vérifier le statut de votre candidature ici : <a href="https://register.ztfuniversity.com/fr/status">register.ztfuniversity.com/fr/status</a></p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 14px;">Institut Universitaire ZTF | Bertoua, Cameroun<br/>Tél : +237 6XX XXX XXX | Email : admissions@ztfuniversity.com</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `ZTF University Admissions <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

export async function sendStatusUpdateEmail(params: {
  to: string;
  firstName: string;
  applicationNumber: string;
  newStatus: string;
  language: 'en' | 'fr';
  notes?: string;
}) {
  const { to, firstName, applicationNumber, newStatus, language, notes } = params;
  const isEn = language === 'en';

  const statusLabels: Record<string, { en: string; fr: string }> = {
    under_review: { en: 'Under Review', fr: 'En cours d\'examen' },
    shortlisted: { en: 'Shortlisted', fr: 'Présélectionné(e)' },
    admitted: { en: 'ADMITTED', fr: 'ADMIS(E)' },
    rejected: { en: 'Not Successful', fr: 'Non retenu(e)' },
    deferred: { en: 'Deferred', fr: 'Reporté(e)' },
  };

  const statusLabel = statusLabels[newStatus]?.[language] || newStatus;

  const subject = isEn
    ? `Application Status Update – ${applicationNumber}`
    : `Mise à jour du statut – ${applicationNumber}`;

  const html = isEn ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
      <h2>Dear ${firstName},</h2>
      <p>Your application status for <strong>${applicationNumber}</strong> has been updated:</p>
      <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
        <h3 style="color: #003B7A; margin: 0;">Status: ${statusLabel}</h3>
        ${notes ? `<p>${notes}</p>` : ''}
      </div>
      <p>Visit <a href="https://register.ztfuniversity.com/en/status">our portal</a> for more details.</p>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
      <h2>Cher(e) ${firstName},</h2>
      <p>Le statut de votre candidature <strong>${applicationNumber}</strong> a été mis à jour :</p>
      <div style="background: #f0f7ff; border-left: 4px solid #003B7A; padding: 20px; margin: 20px 0;">
        <h3 style="color: #003B7A; margin: 0;">Statut : ${statusLabel}</h3>
        ${notes ? `<p>${notes}</p>` : ''}
      </div>
      <p>Visitez <a href="https://register.ztfuniversity.com/fr/status">notre portail</a> pour plus de détails.</p>
    </div>
  `;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `ZTF University Admissions <${process.env.RESEND_FROM_EMAIL}>`,
      to, subject, html,
    });
  } catch (err) {
    console.error('Status email failed:', err);
  }
}
```

---

### STEP 6 — KEY COMPONENTS

**File: `src/components/registration/StepIndicator.tsx`**
Build a visual step progress bar with:
- Step numbers 1-6 with icons
- Completed steps shown in green (checkmark)
- Current step highlighted in university blue (#003B7A)
- Bilingual step labels from translations
- Mobile-responsive (numbers only on small screens)

**File: `src/components/registration/FileUploader.tsx`**
Build a drag-and-drop file uploader with:
- react-dropzone integration
- Shows file name, size, type icon after upload
- Progress bar during upload
- Remove button
- Error states (file too large, wrong type)
- Bilingual labels

**File: `src/components/registration/LanguageSwitcher.tsx`**
- Globe icon button
- Toggles between EN and FR
- Uses next-intl `useRouter` and `usePathname`
- Persists language preference in localStorage

---

### STEP 7 — PAGE LAYOUTS

**File: `src/app/[locale]/layout.tsx`**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!['en', 'fr'].includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**File: `src/app/[locale]/page.tsx`** — LANDING PAGE
Build a beautiful, professional landing page with:
- ZTF University colors: Navy Blue (#003B7A), Gold (#C9A84C), White
- Hero section: University name, bilingual subtitle, CTA buttons
- Programme cards: 3 Anglophone (HND, BTech, MTech) + 3 Francophone (BTS, Licence, Master)
- 6-step registration process visual
- Why choose ZTF section
- Quick links back to www.ztfuniversity.com
- Language switcher in navbar
- Mobile responsive
- Footer with contact info and links

**File: `src/app/[locale]/register/[step]/page.tsx`**
```typescript
import { RegistrationLayout } from '@/components/registration/RegistrationLayout';
import Step1Personal from '@/components/registration/steps/Step1Personal';
import Step2Academic from '@/components/registration/steps/Step2Academic';
import Step3Programme from '@/components/registration/steps/Step3Programme';
import Step4Documents from '@/components/registration/steps/Step4Documents';
import Step5Guardian from '@/components/registration/steps/Step5Guardian';
import Step6Review from '@/components/registration/steps/Step6Review';

const STEP_COMPONENTS = {
  '1': Step1Personal,
  '2': Step2Academic,
  '3': Step3Programme,
  '4': Step4Documents,
  '5': Step5Guardian,
  '6': Step6Review,
};

export default function RegistrationStepPage({ params }: { params: { step: string; locale: string } }) {
  const StepComponent = STEP_COMPONENTS[params.step as keyof typeof STEP_COMPONENTS];
  if (!StepComponent) notFound();

  return (
    <RegistrationLayout currentStep={parseInt(params.step)}>
      <StepComponent />
    </RegistrationLayout>
  );
}
```

---

### STEP 8 — ADMIN DASHBOARD

**File: `src/app/[locale]/admin/(dashboard)/page.tsx`** — DASHBOARD
Build the dashboard with:
- Stats cards: Total, Pending, Admitted, Rejected (with icons and trend indicators)
- Bar chart: Applications by programme (using recharts or CSS bars)
- Pie/donut: By status
- Recent applications table (last 10)
- Quick action buttons

**File: `src/app/[locale]/admin/(dashboard)/applications/page.tsx`** — APPLICATIONS LIST
Build with:
- Searchable, filterable, sortable table
- Columns: App No., Name, Email, Programme, Status, Date, Actions
- Pagination
- Bulk status updates (select multiple → change status)
- Export to Excel and PDF buttons
- Status color badges

**File: `src/app/[locale]/admin/(dashboard)/applications/[id]/page.tsx`** — APPLICATION DETAIL
Build with:
- Full student info display in tabs (Personal, Academic, Programme, Documents, Guardian)
- Document viewer (image/PDF preview)
- Status change dropdown + confirm dialog
- Admin notes text area
- Application history timeline
- Send email button
- Print application button
- Download all documents as ZIP

---

### STEP 9 — DEPLOYMENT CONFIGURATION

**File: `next.config.js`**
```javascript
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  async rewrites() {
    return [];
  },
};

module.exports = withNextIntl(nextConfig);
```

**File: `ecosystem.config.js`** (PM2 for Hostinger)
```javascript
module.exports = {
  apps: [{
    name: 'ztf-registration',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    autorestart: true,
    watch: false,
  }],
};
```

**File: `.htaccess`** (Hostinger reverse proxy)
```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

**File: `package.json` scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "deploy": "npm run build && pm2 restart ztf-registration"
  }
}
```

---

## 🎨 DESIGN SYSTEM

### Colors (Tailwind config extension)
```javascript
colors: {
  ztf: {
    navy: '#003B7A',
    navyDark: '#002855',
    navyLight: '#0056B3',
    gold: '#C9A84C',
    goldLight: '#E8C96B',
    goldDark: '#A0823A',
  }
}
```

### Typography
- Headings: `font-bold` Inter
- Body: Inter Regular
- Labels: `text-sm font-medium text-gray-700`

### Component Conventions
- All cards: `rounded-xl shadow-sm border border-gray-100`
- Primary buttons: `bg-ztf-navy hover:bg-ztf-navyDark text-white`
- Secondary buttons: `border border-ztf-navy text-ztf-navy hover:bg-blue-50`
- Status badges: color-coded (pending=yellow, admitted=green, rejected=red, shortlisted=blue)

---

## 🔒 SECURITY CHECKLIST

- [ ] Rate limiting on registration API (max 5 submissions per IP per day)
- [ ] CSRF protection (Next.js built-in)
- [ ] File type validation server-side (not just mime-type)
- [ ] XSS protection (React's built-in + CSP headers)
- [ ] SQL injection prevention (Supabase parameterized queries)
- [ ] Admin routes protected by Supabase auth middleware
- [ ] Sensitive env vars never exposed to client
- [ ] Storage bucket access policies (private for documents)
- [ ] Application number not guessable (sequential but prefixed)

---

## 🚀 BUILD ORDER FOR CLAUDE CODE

Run these prompts in Cursor Claude Code **in order**:

**Prompt 1:** "Set up the Next.js 14 project with TypeScript, Tailwind, shadcn/ui, next-intl. Create the i18n config, middleware, and both en.json and fr.json message files exactly as specified. Set up the folder structure."

**Prompt 2:** "Create all TypeScript types in src/types/index.ts, the programmes constants, documents constants, Supabase client files, and Zustand registration store."

**Prompt 3:** "Create all API routes: registration/start, registration/upload, registration/submit, status check, and admin applications routes."

**Prompt 4:** "Build the public landing page (src/app/[locale]/page.tsx) with hero, programmes section, steps overview. Use ZTF navy and gold colors. Make it bilingual and responsive."

**Prompt 5:** "Build the RegistrationLayout with StepIndicator, LanguageSwitcher, and Navbar. Then build Steps 1 (Personal) and 2 (Academic) with full React Hook Form + Zod validation, bilingual labels."

**Prompt 6:** "Build Steps 3 (Programme Selection) and 4 (Document Upload with FileUploader component using react-dropzone and Supabase upload)."

**Prompt 7:** "Build Steps 5 (Guardian/Emergency) and 6 (Review & Submit with success page and receipt download)."

**Prompt 8:** "Build the Admin login page and admin layout with sidebar. Then build the Dashboard with stats cards and recent applications."

**Prompt 9:** "Build the Applications list page with search, filter, pagination, bulk actions, and export. Build the Application Detail page with tabs, document viewer, status management, and history timeline."

**Prompt 10:** "Add email utilities with Resend, set up deployment config for Hostinger (next.config.js, ecosystem.config.js, .htaccess). Do a full review pass for i18n completeness — every text must be translatable."

---

## 📋 ADMIN CREDENTIALS SETUP

After deploying, create the first admin user in Supabase:
1. Go to Supabase Dashboard → Authentication → Users → Create User
2. Email: `admin@ztfuniversity.com`, Password: (strong password)
3. Run in SQL Editor:
```sql
INSERT INTO admin_users (user_id, full_name, role, department)
SELECT id, 'ZTF Administrator', 'super_admin', 'Administration'
FROM auth.users
WHERE email = 'admin@ztfuniversity.com';
```

---

## 🌐 DOMAIN SETUP ON HOSTINGER

1. Add subdomain `register` in Hostinger → Domains → Subdomains
2. Set document root to your Next.js app folder
3. Enable Node.js in Hostinger control panel
4. Set Node.js version to 20.x
5. Set startup file to `server.js` (Next.js standalone)
6. Set environment variables in Hostinger → Node.js → Environment Variables
7. Install PM2: `npm install -g pm2`
8. Start: `pm2 start ecosystem.config.js`
9. Enable SSL certificate for register.ztfuniversity.com

---

## ✅ FINAL CHECKLIST

- [ ] All 6 registration steps functional with validation
- [ ] File uploads working (PDF, images, Excel)
- [ ] Both EN and FR translations complete and consistent
- [ ] Language switcher works on all pages
- [ ] Auto-save draft every 30 seconds
- [ ] Application number generated automatically (ZTF-2025-00001)
- [ ] Confirmation email sent on submission
- [ ] Status check page working
- [ ] Admin can login securely
- [ ] Dashboard shows real stats
- [ ] Applications filterable and exportable to Excel
- [ ] Admin can change application status
- [ ] Status change sends email to student
- [ ] Document viewer works in admin
- [ ] Mobile responsive on all pages
- [ ] Link back to www.ztfuniversity.com in navbar
- [ ] Deployed to register.ztfuniversity.com on Hostinger
- [ ] SSL certificate active
