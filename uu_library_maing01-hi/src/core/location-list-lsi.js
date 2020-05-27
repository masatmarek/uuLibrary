const Lsi = {
  from: { cs: "od", en: "from" },
  to: { cs: "do", en: "to" },
  monday: { cs: "Pondělí", en: "Monday" },
  tuesday: { cs: "Úterý", en: "Tuesday" },
  wednesday: { cs: "Středa", en: "Wednesday" },
  thursday: { cs: "Čtvrtek", en: "Thursday" },
  friday: { cs: "Pátek", en: "Friday" },
  author: { cs: "Autor", en: "Author" },
  state: { cs: "Stav", en: "State" },
  active: { cs: "Aktivní", en: "Active" },
  passive: { cs: "Pozastavená", en: "Suspend" },
  closed: { cs: "Zavřená", en: "Closed" },
  capacity: { cs: "Kapacita", en: "Capacity" },
  updateButton: { cs: "Upravit", en: "Update" },
  deleteButton: { cs: "Smazat", en: "Delete" },
  createButton: { cs: "Vytvořit", en: "Create" },
  borrowButton: { cs: "Půjčit", en: "Borrow" },
  returnButton: { cs: "Vrátit", en: "Return" },
  deleteLocation: { cs: "Smazat lokaci", en: "Delete location" },
  createLocation: { cs: "Vytvořit lokaci", en: "Create location" },
  forceDelete: { cs: "Smazat i knihy z lokace", en: "Delete books from location" },
  areYouSureToDelete: { cs: "Jste si jistý?", en: "Are your sure?" },
  cancel: { cs: "Zrušit", en: "Cancel" },
  required: {
    cs: "Toto pole je povinné.",
    en: "This input is required."
  },
  nameLabel: { cs: "Název", en: "Name" },
  codeLabel: { cs: "Kód", en: "Code" },
  capacityLabel: { cs: "Kapacita", en: "Capacity" },
  //failed codes
  "uu-library-main/location/delete/locationContainBooks": {
    cs: "Lokace obsahuje nějaké knihy, pokud chcete smazat lokaci i s knihami zaškrtněte tuto možnost ve formuláři,",
    en: "Location contains some books. If you want to delte them. Then choose this option in form."
  },
  "uu-library-main/location/delete/locationDoesNotExist":{
    cs: "Lokace neexisutje",
    en: "Location does not exist."
  }
};

export default Lsi;
