import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CrearTareaRequest, EditarTareaRequest, Tarea } from '../../../core/models';

export interface CrearTareaDialogData {
  tarea?: Tarea;
}

@Component({
  selector: 'app-crear-tarea-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './crear-tarea-dialog.component.html',
  styleUrl: './crear-tarea-dialog.component.scss'
})
export class CrearTareaDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CrearTareaDialogComponent>);
  private data = inject<CrearTareaDialogData>(MAT_DIALOG_DATA, { optional: true }) ?? {};

  esEdicion = !!this.data.tarea;

  form = this.fb.group({
    nombre: [this.data.tarea?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
    valorPuntos: [
      this.data.tarea?.valorPuntos ?? 10,
      [Validators.required, Validators.min(-999), Validators.max(999)]
    ],
    notasAdicionales: [this.data.tarea?.notasAdicionales ?? '']
  });

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.value;
    const request: CrearTareaRequest | EditarTareaRequest = {
      nombre: valores.nombre!.trim(),
      valorPuntos: valores.valorPuntos!,
      notasAdicionales: valores.notasAdicionales?.trim() || undefined
    };

    this.dialogRef.close(request);
  }
}