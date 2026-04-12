// TC Interior — frontend/src/hooks/useQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, categoriesAPI, enquiriesAPI, galleryAPI, testimonialsAPI, servicesAPI, blogAPI, siteSettingsAPI, analyticsAPI, contactAPI, profileAPI, auditLogAPI } from '@services/api';

export const QK = {
  products:    (p) => p ? ['products',p] : ['products'],
  product:     (slug) => ['product',slug],
  categories:  ['categories'],
  enquiries:   (p) => p ? ['enquiries',p] : ['enquiries'],
  gallery:     (p) => p ? ['gallery',p] : ['gallery'],
  testimonials:['testimonials'],
  services:    ['services'],
  blog:        (p) => p ? ['blog',p] : ['blog'],
  blogPost:    (slug) => ['blog-post',slug],
  siteSettings:['site-settings'],
  profile:     ['profile'],
  analytics:   (p) => p ? ['analytics',p] : ['analytics'],
};

// Products
export const useProducts  = (params) => useQuery({ queryKey:QK.products(params), queryFn:()=>productsAPI.getAll(params).then(r=>r.data?.data||{products:[],total:0}) });
export const useProduct   = (slug)   => useQuery({ queryKey:QK.product(slug), queryFn:()=>productsAPI.getBySlug(slug).then(r=>r.data?.data||null), enabled:!!slug });
export const useAdminProducts = ()   => useQuery({ queryKey:['admin-products'], queryFn:()=>productsAPI.getAdminAll().then(r=>r.data?.data||[]) });
export const useCreateProduct = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(d)=>productsAPI.create(d), onSuccess:()=>{ qc.invalidateQueries({queryKey:['products']}); qc.invalidateQueries({queryKey:['admin-products']}); } }); };
export const useUpdateProduct = () => { const qc=useQueryClient(); return useMutation({ mutationFn:({id,data})=>productsAPI.update(id,data), onSuccess:()=>{ qc.invalidateQueries({queryKey:['products']}); qc.invalidateQueries({queryKey:['admin-products']}); } }); };
export const useDeleteProduct = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(id)=>productsAPI.delete(id), onSuccess:()=>{ qc.invalidateQueries({queryKey:['products']}); qc.invalidateQueries({queryKey:['admin-products']}); } }); };

// Categories
export const useCategories      = ()   => useQuery({ queryKey:QK.categories, queryFn:()=>categoriesAPI.getAll().then(r=>r.data?.data||[]) });
export const useAdminCategories = ()   => useQuery({ queryKey:['admin-categories'], queryFn:()=>categoriesAPI.getAdminAll().then(r=>r.data?.data||[]) });
export const useCreateCategory  = ()   => { const qc=useQueryClient(); return useMutation({ mutationFn:(d)=>categoriesAPI.create(d), onSuccess:()=>qc.invalidateQueries({queryKey:['categories']}) }); };
export const useUpdateCategory  = ()   => { const qc=useQueryClient(); return useMutation({ mutationFn:({id,data})=>categoriesAPI.update(id,data), onSuccess:()=>qc.invalidateQueries({queryKey:['categories']}) }); };
export const useDeleteCategory  = ()   => { const qc=useQueryClient(); return useMutation({ mutationFn:(id)=>categoriesAPI.delete(id), onSuccess:()=>qc.invalidateQueries({queryKey:['categories']}) }); };

// Enquiries
export const useEnquiries = (p) => useQuery({ queryKey:QK.enquiries(p), queryFn:()=>enquiriesAPI.getAll(p).then(r=>r.data||{}) });
export const useSubmitEnquiry = () => useMutation({ mutationFn:(d)=>enquiriesAPI.submit(d) });

// Gallery
export const useGallery      = (p) => useQuery({ queryKey:QK.gallery(p), queryFn:()=>galleryAPI.getAll(p).then(r=>r.data?.data||[]) });
export const useAdminGallery = ()  => useQuery({ queryKey:['admin-gallery'], queryFn:()=>galleryAPI.getAdminAll().then(r=>r.data?.data||[]) });
export const useDeleteGallery = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(id)=>galleryAPI.delete(id), onSuccess:()=>qc.invalidateQueries({queryKey:['gallery']}) }); };

// Testimonials, Services, Blog
export const useTestimonials  = ()   => useQuery({ queryKey:QK.testimonials, queryFn:()=>testimonialsAPI.getAll().then(r=>(r.data?.data||[]).filter(x=>x.visible!==false)) });
export const useServices      = ()   => useQuery({ queryKey:QK.services, queryFn:()=>servicesAPI.getAll().then(r=>(r.data?.data||[]).filter(x=>x.visible!==false)) });
export const useBlogPosts     = (p)  => useQuery({ queryKey:QK.blog(p), queryFn:()=>blogAPI.getAll(p).then(r=>r.data?.data||[]) });
export const useBlogPost      = (s)  => useQuery({ queryKey:QK.blogPost(s), queryFn:()=>blogAPI.getBySlug(s).then(r=>r.data?.data||null), enabled:!!s, retry:(c,e)=>e?.response?.status!==404&&c<1 });
export const useSiteSettings  = ()   => useQuery({ queryKey:QK.siteSettings, queryFn:()=>siteSettingsAPI.get().then(r=>r.data?.data||null) });
export const useProfile       = ()   => useQuery({ queryKey:QK.profile, queryFn:()=>profileAPI.get().then(r=>r.data?.data||null) });
export const useAnalyticsDashboard = (p) => useQuery({ queryKey:QK.analytics(p), queryFn:()=>analyticsAPI.getDashboard(p).then(r=>r.data?.data||null), staleTime:2*60*1000 });
export const useUpdateProfile = ()   => { const qc=useQueryClient(); return useMutation({ mutationFn:(d)=>profileAPI.update(d), onSuccess:()=>qc.invalidateQueries({queryKey:QK.profile}) }); };
export const useUpdateSiteSettings = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(d)=>siteSettingsAPI.update(d), onSuccess:()=>qc.invalidateQueries({queryKey:QK.siteSettings}) }); };
export const useAuditLog = (p) => useQuery({ queryKey:['audit-log',p], queryFn:()=>auditLogAPI.getAll(p).then(r=>r.data||{}) });
