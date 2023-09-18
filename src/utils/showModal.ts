export const showModal = (modalName: string) => {
    const modal: HTMLDialogElement | null = document.querySelector(
      `#${modalName}`
    );
    if (modal !== null) {
      if (!modal.open) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  };