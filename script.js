let reservas = [];
let editIndex = null;

// Solo deja poner números en el input de matrícula
document.getElementById('matricula').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '');
});

// Manejo del formulario al hacer "submit"
document.getElementById('reservaForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Recojo los datos del formulario
  const nombre = document.getElementById('nombre').value.trim();
  const matricula = document.getElementById('matricula').value.trim();
  const actividad = document.getElementById('actividad').value;
  const fecha = document.getElementById('fecha').value;

  // Validaciones básicas
  if (!nombre || !matricula || !actividad || !fecha) {
    alert('No seas flojo, llena todos los campos.');
    return;
  }

  if (!/^\d{8}$/.test(matricula)) {
    alert('La matrícula debe tener exactamente 8 números.');
    return;
  }

  // Valido que la fecha no sea en el pasado (toma en cuenta la zona horaria GMT-5)
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  const fechaLocal = hoy.toISOString().split('T')[0];

  if (fecha < fechaLocal) {
    alert('No se puede reservar para el pasado, bro.');
    return;
  }

  // Verificar que no se repita la matrícula (a menos que estés editando)
  const yaExiste = reservas.some((r, i) => r.matricula === matricula && i !== editIndex);
  if (yaExiste) {
    alert('Ya hay una reserva con ese código de matrícula.');
    return;
  }

  const reserva = { nombre, matricula, actividad, fecha };

  if (editIndex === null) {
    reservas.push(reserva); // Nuevo registro
  } else {
    reservas[editIndex] = reserva; // Actualizo existente
    editIndex = null;
    document.getElementById('btnGuardar').textContent = 'Guardar Reserva';
  }

  this.reset(); // Limpia los campos
  renderTabla(); // Actualiza la tabla
  actualizarContador(); // Refresca el contador
});

// Renderiza las reservas en la tabla
function renderTabla() {
  const tbody = document.querySelector('#tablaReservas tbody');
  tbody.innerHTML = '';

  reservas.forEach((reserva, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${reserva.nombre}</td>
      <td>${reserva.matricula}</td>
      <td>${reserva.actividad}</td>
      <td>${reserva.fecha}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarReserva(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${index})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  actualizarContador();
}

// Modo edición: carga los datos al formulario
function editarReserva(index) {
  const r = reservas[index];
  document.getElementById('nombre').value = r.nombre;
  document.getElementById('matricula').value = r.matricula;
  document.getElementById('actividad').value = r.actividad;
  document.getElementById('fecha').value = r.fecha;

  editIndex = index;
  document.getElementById('btnGuardar').textContent = 'Actualizar Reserva';
}

// Borra una reserva, pero con confirmación
function eliminarReserva(index) {
  if (confirm('¿Seguro que quieres eliminar esta reserva?')) {
    reservas.splice(index, 1);
    renderTabla();
  }
}

// Limpia el formulario sin afectar los datos guardados
function limpiarFormulario() {
  document.getElementById('reservaForm').reset();
  editIndex = null;
  document.getElementById('btnGuardar').textContent = 'Guardar Reserva';
}

// Actualiza el número total de reservas mostradas
function actualizarContador() {
  document.getElementById('contador').textContent = reservas.length;
}

// Bloquea fechas anteriores desde el inicio
window.addEventListener('DOMContentLoaded', () => {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  const fechaLocal = hoy.toISOString().split('T')[0];
  document.getElementById('fecha').setAttribute('min', fechaLocal);
});