const Lsi = {
  stateLabel: { cs: "Stav", en: "State" },
  bookList: { cs: "List knížek", en: "Book list" },
  author: { cs: "Autor", en: "Author" },
  state: { cs: "Stav", en: "State" },
  header: { cs: "Knihy", en: "Books" },
  available: { cs: "Dostupná", en: "Available" },
  borrowed: { cs: "Zapůjčená", en: "Borrowed" },
  reserved: { cs: "Rezervovaná", en: "Reserved" },
  location: { cs: "Lokace", en: "Location" },
  condition: { cs: "Kondice", en: "Condition" },
  genre: { cs: "Žánr", en: "Genre" },
  code: { cs: "Kód", en: "Code" },
  relocateButton: { cs: "Přemístit", en: "Relocate" },
  updateButton: { cs: "Upravit", en: "Update" },
  deleteButton: { cs: "Smazat", en: "Delete" },
  createButton: { cs: "Vytvořit", en: "Create" },
  borrowButton: { cs: "Půjčit", en: "Borrow" },
  returnButton: { cs: "Vrátit", en: "Return" },
  deleteBook: { cs: "Smazat knihu", en: "Delete book" },
  publisher: { cs: "Vydavatel", en: "Publisher" },
  paperback: { cs: "Měká", en: "Paperback" },
  hardback: { cs: "Tvrdá", en: "Hardback" },
  dateOfPublication: { cs: "Datum vydání", en: "Date of publication" },
  language: { cs: "Jazyk", en: "Language" },
  custody: { cs: "Vazba", en: "Custody" },
  numberOfPages: { cs: "Počet stran", en: "Number of pages" },
  relocateBook: { cs: "Přemístit knihu", en: "Relocate book" },
  areYouSureToDelete: { cs: "Jste si jistý?", en: "Are your sure?" },
  cancel: { cs: "Zrušit", en: "Cancel" },
  delete: { cs: "Smazat", en: "Delete" },
  successBorrowPrefix: { cs: "Žádost o půjčení", en: "" },
  book: { cs: "knihy", en: "" },
  successBorrowSuffix: { cs: "problěhla úspěšně.", en: "" },
  successDelete: { cs: "Smazaní proběhlo úspěšně", en: "Delete of book was successfull" },
  required: {
    cs: "Toto pole je povinné.",
    en: "This input is required."
  },
  fromLabel: {
    cs: "Od kdy si chcete knihu půjčit?",
    en: "Since when do you want borrow a book?"
  },
  requestLabel: {
    cs: "Zažádat",
    en: "Create request"
  },
  successRelocate: location => {
    return {
      cs: `<uu5string/>Přemístění do lokace <strong>${location}</strong> proběhlo úspěšné.`,
      en: `<uu5string/>Relocate of book to location <strong>${location}</strong> was successfull.`
    };
  },
  areYouSure(name) {
    return {
      cs: `<uu5string/>Jste si jistý že chcete smazat knihu: '<strong>${name}</strong>'?`,
      en: `<uu5string/>Are you sure that you want to delete book: '<strong>${name}</strong>'?`
    };
  }
};

export default Lsi;
