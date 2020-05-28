let Lsi = {
  delete: { cs: "Smazat", en: "Delete" },
  cancel: { cs: "Zrušit", en: "Cancel" },

  areYouSure(name) {
    return {
      cs: `<uu5string/>Jste si jistý že chcete smazat knihu: '<strong>${name}</strong>'?`,
      en: `<uu5string/>Are you sure that you want to delete book: '<strong>${name}</strong>'?`
    };
  }
};

export default Lsi;
