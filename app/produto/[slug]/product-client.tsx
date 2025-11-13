{/* TOAST */}
{showToast && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md pointer-events-none">
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl flex gap-3">
      <div className="flex flex-col">
        <span className="text-sm text-zinc-400">Produto adicionado!</span>
        <span className="text-sm">
          {qty} × {product.name} foi adicionado ao carrinho.
        </span>
      </div>
    </div>
  </div>
)}