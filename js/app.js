/* Sitio de muestra: entradas de texto, carta completa y pedido por WhatsApp.
   La pizza 3D de la portada está en js/pizza3d.js */

document.documentElement.classList.replace('no-js', 'js');

const WA = '';   // versión de muestra: sin número
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ======================================================================
   Carta (precios de referencia tomados de Rappi; confirmar con el negocio)
   "fotos" son los nombres de archivo en img/menu/ (.webp), en el orden de los platos.
   Vacío = sin foto.
   ====================================================================== */
const MENU = [
  { id: 'tradicionales', nombre: 'Pizzas tradicionales', nota: 'Precio desde. Tamaño a elegir.', fotos: ['napolitana','hawaiana','pollo-champinones','campesina','mexicana','carnes','vegetariana','bocadillo-queso','chorizo-maiz','carne-molida-maiz','pollo-maiz','solo-pollo','primavera','pepperoni'], items: [
    ['Napolitana', 'Tomate fresco, queso y especias', 15000],
    ['Hawaiana', 'Jamón, piña y queso', 15000],
    ['Pollo y champiñones', 'Pollo, champiñones, queso y jamón', 15000],
    ['Campesina', 'Carne desmechada, maduro, maíz y tocineta', 15000],
    ['Mexicana', 'Carne molida, cebolla, pimentón, jalapeños y maíz', 15000],
    ['Carnes', 'Salami, chorizo, cábano y salchichón', 15000],
    ['Vegetariana', 'Tomate, cebolla, maíz, pimentón y champiñones', 15000],
    ['Bocadillo con queso', 'Bocadillo y queso', 15000],
    ['Chorizo y maíz', 'Chorizo, maíz y queso', 15000],
    ['Carne molida y maíz', 'Carne molida y maíz', 15000],
    ['Pollo y maíz', 'Pollo, maíz y queso', 15000],
    ['Solo pollo', 'Pollo, queso y champiñones', 15000],
    ['Primavera', 'Jamón, tocineta, maíz y pimentón', 15000],
    ['Pepperoni', 'Queso y pepperoni', 18000],
  ] },
  { id: 'especiales', nombre: 'Pizzas especiales', nota: 'Precio desde. Tamaño a elegir.', fotos: ['especial-pizzeria','especial-casa','serrata','pizza-brasa','pepperoni-pina','pork-bbq','marinera','cuatro-quesos','bbq'], items: [
    ['Especial Pizzería', 'Camarones, pollo, tocineta, chorizo, pimentón, cebolla, champiñones y maíz', 18000],
    ['Especial de la casa', 'Salami, chorizo, pepperoni, pollo, tocineta, pimentón, cebolla, cábano y maíz', 18000],
    ['Serrata artesanal', 'Salsa napolitana, mozzarella, rúcula, jamón serrano y parmesano', 19000],
    ['A la brasa', 'Pollo a la brasa, chorizo y pimentón', 18000],
    ['Pepperoni y piña', 'Pepperoni y piña', 18000],
    ['Pork BBQ', 'Chuleta de cerdo ahumada, salsa napolitana, mozzarella y BBQ', 18000],
    ['Marinera', 'Camarones y palmitos de cangrejo', 18000],
    ['Cuatro quesos', 'Mozzarella, americano, queso azul y parmesano', 18000],
    ['BBQ', 'Pollo, maíz, tocineta y salsa BBQ', 18000],
  ] },
  { id: 'hamburguesas', nombre: 'Hamburguesas', nota: 'Todas con papas a la francesa.', fotos: ['hamb-tradicional','hamb-mixta','hamb-brasa','hamb-americana','hamb-house','hamb-pork','hamb-pork-cheese'], items: [
    ['Tradicional', 'Carne de 150 g, cheddar, chorizo, tocineta, cebolla grille y vegetales', 24000],
    ['Mixta', 'Filete de pechuga de 150 g, tocineta, mozzarella y vegetales', 26000],
    ['A la brasa', 'Carne y pollo a la brasa, tocineta, mozzarella y vegetales', 28000],
    ['Americana', 'Doble carne de 150 g, cheddar, tocineta y cebolla grille', 28000],
    ['La House', 'Doble carne, huevo, doble cheddar, tocineta y cebolla grille', 28000],
    ['Pork', 'Carne de 150 g, chuleta de cerdo ahumada, tocineta y mozzarella', 30000],
    ['Pork Cheese', 'Chuleta de cerdo a la brasa y combinación de quesos', 31000],
  ] },
  { id: 'perros', nombre: 'Perros', nota: '', fotos: ['perro-tradicional','perro-brasa','perro-loco'], items: [
    ['Tradicional', 'Salchicha americana, cebolla grille, pollo, quesos, tocineta y papas', 20000],
    ['A la brasa', 'Salchicha, cebolla, tocineta, carne, pollo a la brasa y mozzarella', 25000],
    ['Loco House', 'Salchicha americana, pollo y carne desmechados, cheddar, tocineta y papas', 25000],
  ] },
  { id: 'papitas', nombre: 'Papitas', nota: '', fotos: ['papas-fritas','choripapa','salchipapa','papas-locas','papas-locas-especiales'], items: [
    ['Papas fritas', 'Porción con salsas', 10000],
    ['Choripapa', 'Papas, chorizo, tocineta, cheddar y queso blanco', 18000],
    ['Salchipapa', 'Papas, salchicha, tocineta, cheddar y queso blanco', 18000],
    ['Papas locas', 'Pollo, carne a la brasa, mozzarella, chorizo, cebolla grille, maíz y tártara', 25000],
    ['Papas locas especiales', 'Carne y pollo desmechados, chuleta BBQ, tocineta, mozzarella y chorizo', 27000],
  ] },
  { id: 'panzerottis', nombre: 'Panzerottis y tortillas', nota: 'Las tortillas vienen por 3 unidades.', fotos: ['panzerotti-tradicional','panzerotti-especial','panzerotti-cuatro-quesos','tortillas-integrales','tortillas-tradicionales','tortillas-especiales'], items: [
    ['Panzerotti tradicional', 'Porción individual, sabor a elegir', 22000],
    ['Panzerotti especial', 'Porción individual, relleno a elección', 24000],
    ['Panzerotti cuatro quesos', 'Mozzarella, americano, queso azul y parmesano', 28000],
    ['Tortillas integrales', 'Carne y pollo desmechados con vegetales del día', 15000],
    ['Tortillas tradicionales', 'Relleno a elegir', 16000],
    ['Tortillas especiales', 'Relleno a elección', 18000],
  ] },
  { id: 'platos', nombre: 'Entradas, lasaña y parrilla', nota: '', fotos: ['papa-criolla','palitos-queso','lasana','pechuga','chatas'], items: [
    ['Papa criolla de la casa', 'Con pollo desmechado, mozzarella, tocineta, cheddar y BBQ', 13000],
    ['Palitos de queso y arequipe', '5 unidades', 16700],
    ['Lasaña', 'Boloñesa, pollo desmechado, carne molida y mozzarella', 24000],
    ['Pechuga a la parrilla', '350 g con ensalada del día y papas', 29000],
    ['Chatas a la parrilla', '350 g con chimichurri, queso asado, ensalada y papas', 30000],
  ] },
  { id: 'bebidas', nombre: 'Bebidas', nota: 'Cócteles y helados en el rooftop.', fotos: ['agua','coca-cola','jugo-agua','jugo-leche','granizado'], items: [
    ['Agua Cristal 300 ml', 'Sin gas', 5000],
    ['Coca-Cola 400 ml', 'Original', 5000],
    ['Jugo en agua 16 oz', 'Sabor del día', 7000],
    ['Jugo en leche 16 oz', 'Sabor del día', 8000],
    ['Granizado 16 oz', 'Sabor a elegir', 8000],
  ] },
];

const money = n => '$' + n.toLocaleString('es-CO');

// Hoja de albahaca (para los platos sin foto)
const LEAF = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2C32 10 34 27 20 38C6 27 8 10 20 2Z" fill="none" stroke="#C7A06A" stroke-width="1.6"/><path d="M20 5V36M20 14l6-4M20 21l7-5M20 28l6-4M20 14l-6-4M20 21l-7-5M20 28l-6-4" stroke="#C7A06A" stroke-width="1" fill="none"/></svg>';

/* ======================================================================
   Entradas de texto
   ====================================================================== */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ======================================================================
   Carta y pedido
   ====================================================================== */
const list = document.getElementById('menu-list');
const index = document.getElementById('menu-index');
const cart = new Map();
const byId = new Map();

MENU.forEach(cat => {
  const a = document.createElement('a');
  a.href = '#cat-' + cat.id;
  a.textContent = cat.nombre;
  index.appendChild(a);

  const sec = document.createElement('section');
  sec.className = 'cat';
  sec.id = 'cat-' + cat.id;
  sec.innerHTML = `
    <div class="cat__head rv"><h3>${cat.nombre}</h3>${cat.nota ? `<p>${cat.nota}</p>` : ''}</div>
    <ul class="items"></ul>`;

  const ul = sec.querySelector('.items');
  cat.items.forEach(([nombre, desc, precio], k) => {
    const foto = cat.fotos[k];
    const id = `${cat.id}-${k}`;
    const full = cat.id === 'hamburguesas' ? `Hamburguesa ${nombre}` : cat.id === 'perros' ? `Perro ${nombre}` : cat.id.includes('pizza') || cat.id === 'tradicionales' || cat.id === 'especiales' ? `Pizza ${nombre}` : nombre;
    byId.set(id, { nombre: full, precio, pizza: cat.id === 'tradicionales' || cat.id === 'especiales' });
    const li = document.createElement('li');
    li.className = 'item rv';
    li.style.setProperty('--i', k % 4);
    li.innerHTML = `
      ${foto
        ? `<img class="item__img" src="img/menu/thumb/${foto}.webp" alt="${full}" loading="lazy" width="240" height="240">`
        : `<span class="item__img item__img--none" aria-hidden="true">${LEAF}</span>`}
      <span class="item__name">${nombre}</span>
      <span class="item__price">${precio ? money(precio) : 'Consultar'}</span>
      <span class="item__desc">${desc}</span>
      <div class="item__ctl" data-id="${id}"></div>`;
    ul.appendChild(li);
  });
  list.appendChild(sec);
  sec.querySelectorAll('.rv').forEach(el => io.observe(el));
});

function drawCtl(id) {
  const box = list.querySelector(`.item__ctl[data-id="${id}"]`);
  const q = cart.get(id) || 0;
  const name = byId.get(id).nombre;
  box.innerHTML = q
    ? `<span class="qty pop"><button type="button" data-act="minus" aria-label="Quitar uno de ${name}">−</button><span aria-live="polite">${q}</span><button type="button" data-act="plus" aria-label="Agregar otro de ${name}">+</button></span>`
    : `<button type="button" class="add" data-act="plus" aria-label="Agregar ${name} al pedido">Agregar</button>`;
}

list.addEventListener('click', ev => {
  const btn = ev.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.closest('.item__ctl').dataset.id;
  const q = (cart.get(id) || 0) + (btn.dataset.act === 'plus' ? 1 : -1);
  q > 0 ? cart.set(id, q) : cart.delete(id);
  drawCtl(id);
  const again = list.querySelector(`.item__ctl[data-id="${id}"] button[data-act="${btn.dataset.act}"]`) || list.querySelector(`.item__ctl[data-id="${id}"] button`);
  again && again.focus();
  drawOrder();
});

const orderEl = document.getElementById('order');
function drawOrder() {
  let n = 0, total = 0, consultar = false, pizza = false;
  const lines = [];
  cart.forEach((q, id) => {
    const it = byId.get(id);
    n += q; total += it.precio * q;
    if (!it.precio) consultar = true;
    if (it.pizza) pizza = true;
    lines.push(`• ${q} × ${it.nombre}${it.precio ? ' — ' + money(it.precio * q) : ''}`);
  });
  orderEl.hidden = n === 0;
  document.getElementById('order-count').textContent = n === 1 ? '1 producto' : `${n} productos`;
  document.getElementById('order-total').textContent = money(total);
  const msg = [
    'Hola, quiero hacer este pedido:', '', ...lines, '',
    `Total aproximado: ${money(total)}`,
    pizza ? '(Pizzas: el tamaño lo confirmo con ustedes.)' : '',
    consultar ? '(Hay productos con precio por consultar.)' : '',
    '', 'Nombre:', 'Dirección:',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
  document.getElementById('order-send').href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

document.getElementById('order-clear').addEventListener('click', () => {
  const ids = [...cart.keys()];
  cart.clear();
  ids.forEach(drawCtl);
  drawOrder();
});

MENU.forEach(cat => cat.items.forEach((_, k) => drawCtl(`${cat.id}-${k}`)));

// Resalta la categoría que se está viendo en el índice de la carta
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    index.querySelectorAll('a').forEach(a => {
      const on = a.getAttribute('href') === '#' + en.target.id;
      a.classList.toggle('is-on', on);
      if (on && innerWidth < 768) a.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('.cat').forEach(s => spy.observe(s));
