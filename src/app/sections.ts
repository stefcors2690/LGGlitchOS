export const sections = [
  { id: 'home', label: 'Home', title: 'Oltre lo schermo.', description: 'La nuova Home sta prendendo forma.' },
  { id: 'apps', label: 'App', title: 'Le tue applicazioni.', description: 'Catalogo demo: gli avvii sono simulati, nessuna app reale viene aperta.' },
  { id: 'inputs', label: 'Ingressi', title: 'Ogni sorgente, un mondo.', description: 'La selezione degli ingressi demo arriverà nelle prossime fasi.' },
  { id: 'smart-home', label: 'Domotica', title: 'La casa, al tuo fianco.', description: 'I dispositivi demo saranno disponibili nelle prossime fasi.' },
  { id: 'settings', label: 'Impostazioni', title: 'Il tuo modo di abitare la Home.', description: 'Regola movimento e logo. La preferenza di sistema per il movimento ridotto ha sempre precedenza.' },
] as const;
export type SectionId = typeof sections[number]['id'];
