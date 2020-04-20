const Lsi = {
  bookList: { cs: "List knížek", en: "Book list" },
  author: { cs: "Autor", en: "Author" },
  state: { cs: "Stav", en: "State" },
  available: { cs: "Dostupná", en: "Available" },
  borrowed: { cs: "Zapůjčená", en: "Borrowed" },
  location: { cs: "Oddělení", en: "Location" },
  condition: { cs: "Kondice", en: "Condition" },
  genre: { cs: "Žánr", en: "Genre" },
  code: { cs: "Kód", en: "Code" },
  updateButton: { cs: "Upravit", en: "Update" },
  deleteButton: { cs: "Smazat", en: "Delete" },
  createButton: { cs: "Vytvořit", en: "Create" },
  borrowButton: { cs: "Půjčit", en: "Borrow" },
  returnButton: { cs: "Vrátit", en: "Return" },
  deleteBook: { cs: "Smazat knihu", en: "Delete book" },
  areYouSureToDelete: { cs: "Jste si jistý?", en: "Are your sure?" },
  cancel: { cs: "Zrušit", en: "Cancel" },
  delete: { cs: "Smazat", en: "Delete" },
  successBorrowPrefix: { cs: "Žádost o půjčení", en: "" },
  book: { cs: "knihy", en: "" },
  successBorrowSuffix: { cs: "problěhla úspěšně.", en: "" },
  successDelete: { cs: "Smazaní proběhlo úspěšně", en: "Delete of book was successfull" },
  areYouSure(name) {
    return {
      cs: `Jste si jistý že chcete smazat knihu: '${name}'?`,
      en: `Are you sure that you want to delete book: '${name}'?`
    };
  }
};

export default Lsi;
