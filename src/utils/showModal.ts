export const showModal = (modalName: string, styles: string) => {
    const modal: HTMLDialogElement | null = document.querySelector(
      `#${modalName}`
    );
    if (modal !== null) {
      if (!modal.open) {
        modal.showModal();
        modal.classList.add(styles);
      } else {
        modal.close();
        modal.classList.remove(styles);
      }
    }
  };