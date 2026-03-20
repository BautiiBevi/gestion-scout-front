import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento } from '../../../../models/evento.model';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-calendario-page',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './calendario-page.component.html',
  styleUrl: './calendario-page.component.css',
})
export class CalendarioPageComponent implements OnInit {
  private eventoService = inject(EventoService);
  private fb = inject(FormBuilder);

  public eventos = signal<Evento[]>([]);
  public guardando = signal(false);
  public eventoSeleccionado = signal<Evento | null>(null);

  public proximosEventos = computed(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.eventos()
      .filter((e) => new Date(e.fecha_inicio) >= hoy)
      .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())
      .slice(0, 5);
  });

  public eventoForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: [''],
    fecha_inicio: ['', Validators.required],
    fecha_fin: [''],
    alcance: ['GRUPO', Validators.required],
    color: ['#3b82f6', Validators.required],
  });

  public calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth',
    },
    // Eventos de interacción
    dateClick: (arg) => this.abrirModalNuevo(arg.dateStr),
    eventClick: (arg) => this.verDetalleEvento(arg.event.id),

    // ESTOS DOS SON LOS NUEVOS:
    eventDrop: (info) => this.actualizarFechaEvento(info), // Al moverlo de día
    eventResize: (info) => this.actualizarFechaEvento(info), // Al estirarlo

    events: [],
  };

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventoService.getEventos().subscribe((data) => {
      this.eventos.set(data);
      const eventosFC: EventInput[] = data.map((e) => {
        const fechaInicioLimpia = e.fecha_inicio.slice(0, 10);
        const dInicio = new Date(fechaInicioLimpia + 'T12:00:00');
        const format = (d: Date) => {
          const m = (d.getMonth() + 1).toString().padStart(2, '0');
          const dia = d.getDate().toString().padStart(2, '0');
          return `${d.getFullYear()}-${m}-${dia}`;
        };
        const inicioSimple = format(dInicio);
        let finAjustado = undefined;
        if (e.fecha_fin) {
          const fechaFinLimpia = e.fecha_fin.slice(0, 10);
          const dFin = new Date(fechaFinLimpia + 'T12:00:00');
          dFin.setDate(dFin.getDate() + 1);
          finAjustado = format(dFin);
        }
        return {
          id: e.id_evento.toString(),
          title: e.titulo,
          start: inicioSimple,
          end: finAjustado,
          backgroundColor: e.color,
          borderColor: e.color,
          allDay: true,
          display: 'block',
        };
      });
      this.calendarOptions = { ...this.calendarOptions, events: eventosFC };
    });
  }

  actualizarFechaEvento(info: any) {
    const eventoId = Number(info.event.id);
    const eventoOriginal = this.eventos().find((e) => e.id_evento === eventoId);

    if (!eventoOriginal) return;

    const format = (d: Date | null) => {
      if (!d) return undefined;
      const anio = d.getFullYear();
      const mes = (d.getMonth() + 1).toString().padStart(2, '0');
      const dia = d.getDate().toString().padStart(2, '0');
      return `${anio}-${mes}-${dia}`;
    };

    let fechaFin = info.event.end;
    if (fechaFin) {
      const d = new Date(fechaFin);
      d.setDate(d.getDate() - 1);
      fechaFin = d;
    }

    const datosActualizados: Partial<Evento> = {
      ...eventoOriginal,
      fecha_inicio: format(info.event.start)!,
      fecha_fin: fechaFin ? format(fechaFin) : undefined,
    };

    this.eventoService.updateEvento(eventoId, datosActualizados).subscribe({
      next: () => {
        this.cargarEventos();
        console.log('Evento movido con éxito');
      },
      error: () => {
        alert('Error al mover el evento');
        info.revert();
      },
    });
  }

  // --- MANTENIMIENTO DE MODALES ---

  abrirModalNuevo(fechaSeleccionada?: string) {
    this.eventoSeleccionado.set(null); // Importante: si abrimos uno nuevo, limpiamos la selección
    this.eventoForm.reset({
      alcance: 'GRUPO',
      color: '#3b82f6',
      fecha_inicio: fechaSeleccionada || '',
    });
    (document.getElementById('modal_nuevo_evento') as HTMLDialogElement)?.showModal();
  }

  verDetalleEvento(idEventoStr: string) {
    const evento = this.eventos().find((e) => e.id_evento.toString() === idEventoStr);
    if (evento) {
      this.eventoSeleccionado.set(evento);
      (document.getElementById('modal_detalle_evento') as HTMLDialogElement)?.showModal();
    }
  }

  cerrarDetalle() {
    (document.getElementById('modal_detalle_evento') as HTMLDialogElement)?.close();
  }

  prepararBorrado() {
    this.cerrarDetalle();
    (document.getElementById('modal_borrar_evento') as HTMLDialogElement)?.showModal();
  }

  prepararEdicion() {
    const ev = this.eventoSeleccionado();
    if (!ev) return;

    this.eventoForm.patchValue({
      titulo: ev.titulo,
      descripcion: ev.descripcion,
      fecha_inicio: ev.fecha_inicio.slice(0, 10),
      fecha_fin: ev.fecha_fin ? ev.fecha_fin.slice(0, 10) : '',
      alcance: ev.alcance,
      color: ev.color,
    });

    this.cerrarDetalle();
    (document.getElementById('modal_nuevo_evento') as HTMLDialogElement)?.showModal();
  }

  guardar() {
    if (this.eventoForm.invalid) return;
    this.guardando.set(true);

    const formValue = this.eventoForm.value;
    const datosEvento: Partial<Evento> = {
      titulo: formValue.titulo!,
      descripcion: formValue.descripcion || undefined,
      fecha_inicio: formValue.fecha_inicio!,
      fecha_fin: formValue.fecha_fin || undefined,
      alcance: formValue.alcance!,
      color: formValue.color!,
    };

    const idEdicion = this.eventoSeleccionado()?.id_evento;

    if (idEdicion) {
      this.eventoService.updateEvento(idEdicion, datosEvento).subscribe({
        next: () => this.finalizarGuardado(),
        error: () => this.errorGuardado(),
      });
    } else {
      this.eventoService.crearEvento(datosEvento).subscribe({
        next: () => this.finalizarGuardado(),
        error: () => this.errorGuardado(),
      });
    }
  }

  private finalizarGuardado() {
    this.guardando.set(false);
    this.eventoSeleccionado.set(null);
    this.cerrarModal();
    this.cargarEventos();
  }

  private errorGuardado() {
    alert('Hubo un error al procesar la actividad');
    this.guardando.set(false);
  }

  confirmarBorrado() {
    const evento = this.eventoSeleccionado();
    if (!evento) return;

    this.eventoService.eliminarEvento(evento.id_evento).subscribe({
      next: () => {
        this.cargarEventos();
        this.eventoSeleccionado.set(null);
      },
      error: () => alert('No se pudo borrar el evento'),
    });
  }

  cambiarRama(event: any) {
    const colores: any = {
      GRUPO: '#3b82f6',
      MANADA: '#eab308',
      UNIDAD: '#22c55e',
      CAMINANTES: '#0ea5e9',
      ROVERS: '#ef4444',
    };
    this.eventoForm.patchValue({ color: colores[event.target.value] });
  }

  cerrarModal() {
    (document.getElementById('modal_nuevo_evento') as HTMLDialogElement)?.close();
  }
}
