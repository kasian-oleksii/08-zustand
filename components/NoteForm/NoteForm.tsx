'use client';
import css from './NoteForm.module.css';
import { useId } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import { type NewNote } from '../../types/note';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';

interface NoteFormProps {
  onCloseModal?: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Enter the note title'),
  content: Yup.string().max(500, 'Too Long!'),
  tag: Yup.string().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']),
});

export default function NoteForm({ onCloseModal }: NoteFormProps) {
  const idUse = useId();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (noteData: NewNote) => createNote(noteData),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCloseModal?.(); // виклик лише якщо проп переданий
    },
  });

  const handleSubmit = (
    values: FormValues,
    formikHelper: FormikHelpers<FormValues>,
  ) => {
    formikHelper.resetForm();
    mutate(values);
  };

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${idUse}-title`}>Title</label>
          <Field
            id={`${idUse}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${idUse}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${idUse}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${idUse}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${idUse}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          {onCloseModal && (
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCloseModal}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? 'Creating new note...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
