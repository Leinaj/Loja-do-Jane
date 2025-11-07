export default function Footer(){
  return (
    <footer className="mt-16 border-t border-zinc-800">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="small">© {new Date().getFullYear()} Loja da Jane — feito com amor 💚</p>
        <p className="small">WhatsApp: <a className="underline" href="https://wa.me/5544988606483" target="_blank">+55 (44) 98860-6483</a></p>
      </div>
    </footer>
  );
}