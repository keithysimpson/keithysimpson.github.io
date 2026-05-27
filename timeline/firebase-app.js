/* firebase-app.js
   Firebase initialisation, auth helpers, and Firestore CRUD
   for the Timeline app.
   Loaded AFTER the Firebase compat SDK and events.js. */

// ─── Config & Init ───────────────────────────────────

const firebaseConfig = {
  apiKey: "AIzaSyByxEnDmZpJIWDF1nHuq-WE2bfxY4X5sIk",
  authDomain: "timeline-25a6b.firebaseapp.com",
  projectId: "timeline-25a6b",
  storageBucket: "timeline-25a6b.firebasestorage.app",
  messagingSenderId: "173649124392",
  appId: "1:173649124392:web:b235377abbe7912d14291d"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const auth = firebase.auth();

let currentFirebaseUser = null;
let userCategories      = [];

// ─── Auth ────────────────────────────────────────────

/**
 * Start listening for auth state.  Calls `onReady` once after the
 * first successful authentication (anonymous or otherwise).
 * Subsequent auth-state changes trigger a full refresh automatically.
 */
function initAuth(onReady) {
  let first = true;

  auth.onAuthStateChanged(async user => {
    if (user) {
      currentFirebaseUser = user;
      await loadUserCategories();
      if (typeof syncUserCategoryPreferences === 'function') {
        syncUserCategoryPreferences();
      }

      if (first) {
        first = false;
        if (onReady) onReady();
      } else {
        // Subsequent sign-in / account-link — refresh everything
        if (typeof refreshAfterFirestoreChange === 'function') {
          await refreshAfterFirestoreChange();
        }
        if (typeof updateSignInBanner === 'function') updateSignInBanner();
        if (typeof buildSettingsUI === 'function' &&
            document.getElementById('settings-panel')?.classList.contains('open')) {
          buildSettingsUI();
        }
      }
    } else {
      currentFirebaseUser = null;
      userCategories = [];
      try {
        await auth.signInAnonymously();
      } catch (e) {
        console.error('Anonymous sign-in failed', e);
        if (first) { first = false; if (onReady) onReady(); }
      }
    }
  });
}

/**
 * Sign in with Google.  If the current user is anonymous the
 * anonymous account is linked to the Google credential so that
 * existing Firestore data carries over.  If the Google account
 * already exists the anonymous data is migrated manually.
 */
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const user     = auth.currentUser;

  if (user && user.isAnonymous) {
    try {
      await user.linkWithPopup(provider);
      return { success: true };
    } catch (err) {
      if (err.code === 'auth/credential-already-in-use') {
        // Save anonymous categories before switching
        const anonCats = userCategories.map(c => ({
          name: c.name, desc: c.desc, color: c.color,
          events: c.events.map(e => {
            const o = { ...e };
            delete o._userEvent; delete o._categoryId; delete o._eventIndex;
            delete o.ya; delete o.end_ya; delete o.offset;
            return o;
          })
        }));

        // Sign in with the existing Google credential
        const idToken = err.customData?._tokenResponse?.oauthIdToken;
        if (idToken) {
          const cred = firebase.auth.GoogleAuthProvider.credential(idToken);
          await auth.signInWithCredential(cred);
        } else {
          // Fallback: just do a regular popup
          await auth.signInWithPopup(provider);
        }
        // onAuthStateChanged fires — currentFirebaseUser updated there

        // Migrate anonymous data to the Google account
        for (const cat of anonCats) {
          if (cat.name) {
            await db.collection('users').doc(auth.currentUser.uid)
              .collection('categories').add(cat);
          }
        }
        return { success: true, migrated: true };
      }
      throw err;
    }
  }

  // Not anonymous — just do a regular Google sign-in
  await auth.signInWithPopup(provider);
  return { success: true };
}

async function firebaseSignOut() {
  userCategories = [];
  await auth.signOut();   // triggers onAuthStateChanged → anon re-auth
}

// ─── Firestore CRUD ──────────────────────────────────

function _catCol() {
  return db.collection('users')
           .doc(currentFirebaseUser.uid)
           .collection('categories');
}

async function loadUserCategories() {
  if (!currentFirebaseUser) { userCategories = []; return; }
  try {
    const snap = await _catCol().get();
    userCategories = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id:              'user_' + doc.id,
        _isUserCategory: true,
        _firestoreId:    doc.id,
        name:            d.name  || 'Untitled',
        desc:            d.desc  || '',
        color:           d.color || '#648cff',
        events: (d.events || []).map((e, idx) => ({
          ...e,
          time:        e.time || generateTimeLabel(e),
          _userEvent:  true,
          _categoryId: doc.id,
          _eventIndex: idx
        }))
      };
    });
  } catch (e) {
    console.error('loadUserCategories failed', e);
    userCategories = [];
  }
}

async function fbCreateCategory(name, desc, color) {
  const ref = await _catCol().add({ name, desc, color, events: [] });
  return ref.id;
}

async function fbUpdateCategory(catId, data) {
  await _catCol().doc(catId).update(data);
}

async function fbDeleteCategory(catId) {
  await _catCol().doc(catId).delete();
}

async function fbAddEvent(catId, evt) {
  const ref = _catCol().doc(catId);
  const doc = await ref.get();
  const arr = doc.data().events || [];
  arr.push(evt);
  await ref.update({ events: arr });
}

async function fbUpdateEvent(catId, index, evt) {
  const ref = _catCol().doc(catId);
  const doc = await ref.get();
  const arr = doc.data().events || [];
  if (index >= 0 && index < arr.length) {
    arr[index] = evt;
    await ref.update({ events: arr });
  }
}

async function fbDeleteEvent(catId, index) {
  const ref = _catCol().doc(catId);
  const doc = await ref.get();
  const arr = doc.data().events || [];
  if (index >= 0 && index < arr.length) {
    arr.splice(index, 1);
    await ref.update({ events: arr });
  }
}

// ─── Helpers ─────────────────────────────────────────

function generateTimeLabel(e) {
  const fCY = y => {
    if (y == null) return '';
    return y < 0 ? Math.abs(y).toLocaleString() + ' BCE'
                  : y.toLocaleString() + ' CE';
  };
  const fYA = ya => {
    if (ya == null) return '';
    if (ya >= 1e9) return +(ya / 1e9).toFixed(1) + ' bya';
    if (ya >= 1e6) return +(ya / 1e6).toFixed(1) + ' mya';
    if (ya >= 1e3) return Math.round(ya).toLocaleString() + ' ya';
    return ya + ' ya';
  };

  let s = '', e2 = '';
  if (e.cal_year !== undefined) {
    s = fCY(e.cal_year);
    if (e.end_cal_year !== undefined) e2 = fCY(e.end_cal_year);
  } else if (e.ya !== undefined) {
    s = fYA(e.ya);
    if (e.end_ya !== undefined) e2 = fYA(e.end_ya);
  }
  return e2 ? s + ' \u2013 ' + e2 : s;
}
