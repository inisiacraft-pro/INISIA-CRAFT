'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// ------------------------------------------------------------
// عام: أي زائر يمكنه استدعاء هذا الإجراء لإرسال رسالة/طلب.
// لا حاجة لحساب أو تسجيل دخول. الحماية من السبام هنا بسيطة ومقصودة:
// - تحقق من الحقول الأساسية
// - RLS في قاعدة البيانات تسمح فقط بـ INSERT (لا قراءة، لا تعديل)
// لتفعيل reCAPTCHA لاحقًا، يكفي إضافته هنا فقط دون تغيير أي شيء آخر.
// ------------------------------------------------------------
export async function submitInquiry(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const contact_value = String(formData.get('contact_value') || '').trim();
  const service_interested = String(formData.get('service_interested') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !contact_value || !message) {
    return { ok: false, error: 'يرجى تعبئة كل الحقول المطلوبة.' };
  }
  if (name.length > 100 || contact_value.length > 150 || message.length > 2000) {
    return { ok: false, error: 'أحد الحقول أطول من المسموح.' };
  }

  const supabase = createClient();
  const { error } = await supabase.from('inquiries').insert({
    name,
    contact_value,
    service_interested: service_interested || null,
    message,
  });

  if (error) {
    return { ok: false, error: 'تعذّر إرسال الرسالة، حاولي مرة أخرى لاحقًا.' };
  }
  return { ok: true };
}

// ------------------------------------------------------------
// إدارة — كل الدوال التالية تعتمد على RLS: حتى لو استُدعيت من مصدر
// غير متوقع، Supabase سترفض أي تعديل إن لم تكن الجلسة أدمن.
// ------------------------------------------------------------

export async function adminSignIn(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: 'بيانات الدخول غير صحيحة.' };
  }
  redirect('/admin');
}

export async function adminSignOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function upsertService(formData: FormData) {
  const id = String(formData.get('id') || '') || undefined;
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const price_from = formData.get('price_from') ? Number(formData.get('price_from')) : null;
  const image_url = String(formData.get('image_url') || '').trim() || null;
  const is_active = formData.get('is_active') === 'on';

  if (!title) return { ok: false, error: 'العنوان مطلوب.' };

  const supabase = createClient();
  const payload = { title, description, price_from, image_url, is_active };

  const { error } = id
    ? await supabase.from('services').update(payload).eq('id', id)
    : await supabase.from('services').insert(payload);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/services');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteService(id: string) {
  const supabase = createClient();
  await supabase.from('services').delete().eq('id', id);
  revalidatePath('/admin/services');
  revalidatePath('/');
}

export async function upsertGalleryItem(formData: FormData) {
  const image_url = String(formData.get('image_url') || '').trim();
  const caption = String(formData.get('caption') || '').trim() || null;
  if (!image_url) return { ok: false, error: 'رابط الصورة مطلوب.' };

  const supabase = createClient();
  const { error } = await supabase.from('gallery_items').insert({ image_url, caption });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/gallery');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteGalleryItem(id: string) {
  const supabase = createClient();
  await supabase.from('gallery_items').delete().eq('id', id);
  revalidatePath('/admin/gallery');
  revalidatePath('/');
}

export async function updateSettings(formData: FormData) {
  const supabase = createClient();
  const payload = {
    whatsapp_number: String(formData.get('whatsapp_number') || '').trim() || null,
    contact_email: String(formData.get('contact_email') || '').trim() || null,
    facebook_url: String(formData.get('facebook_url') || '').trim() || null,
    instagram_url: String(formData.get('instagram_url') || '').trim() || null,
    address: String(formData.get('address') || '').trim() || null,
    hero_title: String(formData.get('hero_title') || '').trim() || null,
    hero_subtitle: String(formData.get('hero_subtitle') || '').trim() || null,
    about_text: String(formData.get('about_text') || '').trim() || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('site_settings').update(payload).eq('id', 1);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { ok: true };
}

export async function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'done') {
  const supabase = createClient();
  await supabase.from('inquiries').update({ status }).eq('id', id);
  revalidatePath('/admin/messages');
}

export async function deleteInquiry(id: string) {
  const supabase = createClient();
  await supabase.from('inquiries').delete().eq('id', id);
  revalidatePath('/admin/messages');
}
