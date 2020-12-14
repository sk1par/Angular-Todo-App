import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private afs: AngularFirestore,
    private toastr: ToastrService
  ) { }

  saveTodo(id: string, data) {
    this.afs.collection('categories').doc(id).collection('todos').add(data).then(ref => {
      this.afs.doc(`categories/${id}`).update({todoCount: firebase.firestore.FieldValue.increment(1)});
      this.toastr.success('New Todo Saved Successfully!');
    });
  }

  loadTodos(todoId: string) {
    return this.afs.collection('categories').doc(todoId).collection('todos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        }))
    );
  }

  updatetodo(catId: string, todoId, updatedData: string) {
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({todo: updatedData}).then(() => {
      this.toastr.success('Todo Updated Successfully!');
    });
  }

  deleteTodo(catId: string, todoId: string) {
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).delete().then(() => {
      this.afs.doc(`categories/${catId}`).update({todoCount: firebase.firestore.FieldValue.increment(-1)});
      this.toastr.error('Todo was successfully deleted!');
    });
  }

  markComplete(catId: string, todoId: string) {
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({isCompleted: true}).then(() => {
      this.toastr.info('Todo Market Complete');
    });
  }

  markIncomplete(catId: string, todoId: string) {
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({isCompleted: false}).then(() => {
      this.toastr.warning('Todo Market Incomplete');
    });
  }
}
