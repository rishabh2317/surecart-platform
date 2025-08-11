// app/(creator)/collections/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCollection, searchProducts } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import { ArrowLeft, Save, Check, Copy, X, UploadCloud, Edit, Search } from 'lucide-react';

// --- Types ---
interface Product { id: string; name: string; brand: string; imageUrl: string; }
interface User { id: string; username: string; email: string; }
interface Brand { id: string; name: string; }

// --- API Functions ---
const getBrands = async (): Promise<Brand[]> => {
    const res = await fetch(`http://localhost:3001/brands`);
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
};

// --- Main Component ---
export default function NewCollectionPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  const [collectionName, setCollectionName] = useState('My New Collection');
  const [description, setDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const [shareableLink, setShareableLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
 

  useEffect(() => {
    const sessionUser = getUserSession();
    if (!sessionUser) router.push('/login');
    else setUser(sessionUser);
  }, [router]);

  // Fetching logic
  //const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const { data: availableProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', searchTerm, selectedBrand],
    queryFn: () => searchProducts(searchTerm, selectedBrand),
  });

  const createCollectionMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
      const slug = data.slug;
      const username = user?.username || 'creator';
      setShareableLink(`http://localhost:3000/${username}/${slug}`);
      setShowModal(true);
    },
    onError: (error) => { alert(`Error: ${error.message}`); }
  });

  // Handlers
  const [isUploading, setIsUploading] = useState(false);

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX_FILE_SIZE = 1 * 1024 * 1024; // 10MB

      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please select an image under 10MB.");
        return;
      }
      setIsUploading(true);

      const formData = new FormData();
      formData.append('image', file);
      
      const IMGBB_API_KEY = '5dc139f5ddfcb2f57f4f2e87b9d40dce'; // Replace with your key

      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setCoverImage(data.data.url);
        } else {
          // This will now tell you if the API key is the problem
          throw new Error(data.error?.message || 'Image upload failed');
        }
      } catch (error: any) {
        // Provide a world-class error message
        alert(`Could not upload image: ${error.message}. Please ensure your ImgBB API key is correct.`);
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  

  const handleSave = () => {
    if (!user) return alert("You must be logged in.");
    if (!collectionName || selectedProducts.length === 0) {
      return alert("Please add a name and at least one product.");
    }
    createCollectionMutation.mutate({
      name: collectionName, products: selectedProducts, userId: user.id,
      description: description, coverImageUrl: coverImage,
    });
  };

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts(prev => 
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  // THIS IS THE FIX: The missing functions are now included
  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  };
  
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"><Check className="h-8 w-8 text-green-600" /></div>
            <h3 className="text-2xl font-bold text-slate-800">Published!</h3>
            <p className="mt-2 text-slate-600">Your collection is live. Share this link with your audience.</p>
            <div className="mt-6 flex rounded-lg shadow-sm">
              <input type="text" readOnly className="flex-1 block w-full px-3 py-2 rounded-none rounded-l-lg bg-slate-100 text-slate-700 sm:text-sm border border-slate-300" value={shareableLink} />
              <button onClick={handleCopy} className={`inline-flex items-center px-4 py-2 border border-l-0 rounded-r-lg text-sm font-medium text-white ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <button onClick={closeModal} className="mt-6 w-full px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Done</button>
          </div>
        </div>
      )}

      <div className="flex flex-col h-screen bg-slate-50">
        <header className="bg-white p-4 border-b">
          <div className="container mx-auto flex items-center justify-between">
              <Link href="/dashboard" className="text-slate-600"><ArrowLeft/></Link>
              <h1 className="text-xl font-bold text-slate-900">Create Collection</h1>
              <button onClick={handleSave} disabled={createCollectionMutation.isPending} className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:bg-indigo-400">
                  {createCollectionMutation.isPending ? 'Publishing...' : 'Publish'}
              </button>
          </div>
        </header>
        <div className="flex-grow flex-1 flex flex-col md:flex-row overflow-hidden">
          <aside className="w-full md:w-1/2 bg-white border-r overflow-y-auto p-4">
            <div className="sticky top-0 bg-white pt-2 pb-4">
              <div className="relative mb-4">
                  <input type="search" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <Search className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                  <button onClick={() => setSelectedBrand(null)} className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${!selectedBrand ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>All Brands</button>
                  {brands.map(brand => (
                      <button key={brand.id} onClick={() => setSelectedBrand(brand.id)} className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${selectedBrand === brand.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{brand.name}</button>
                  ))}
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {isLoadingProducts ? <p>Loading...</p> : availableProducts.map((product: Product) => {
                  const isSelected = selectedProducts.some(p => p.id === product.id);
                  return (
                      <div key={product.id} onClick={() => toggleProductSelection(product)} className={`p-2 border rounded-lg cursor-pointer ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-200'}`}>
                          <div className="aspect-square bg-slate-100 rounded-md overflow-hidden mb-2"><img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /></div>
                          <p className="font-semibold text-sm text-slate-800 truncate">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                      </div>
                  );
              })}
            </div>
          </aside>
          <main className="w-full md:w-1/2 p-6 overflow-y-auto">
            <div className="flex items-center space-x-2 mb-4">
              <input type="text" className="text-2xl font-bold text-slate-900 bg-transparent flex-grow" value={collectionName} onChange={e => setCollectionName(e.target.value)} />
              <Edit className="w-5 h-5 text-slate-400" />
            </div>
            <textarea className="w-full p-3 border rounded-lg mb-6 bg-white placeholder-slate-500" placeholder="Add a personal note about this collection..." value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="mb-6">
    <label className="block text-sm font-medium text-slate-700 mb-2">Cover Photo (Optional)</label>
    {/* This container is now smaller and centered */}
    <div className="mt-1 relative max-w-md mx-auto">
    <div 
        className="aspect-[4/3] w-full flex justify-center items-center border-2 border-slate-300 border-dashed rounded-2xl bg-white bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
    >
        {/* The upload prompt is only visible when there is no image */}
        {!coverImage && !isUploading && (
            <div className="text-center p-4">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 mt-2">
                    <label htmlFor="cover-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="cover-upload" name="cover-upload" type="file" className="sr-only" onChange={handleCoverImageUpload} disabled={isUploading} />
                    </label>
                </div>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
        )}
        {isUploading && (
            <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-600">Uploading...</p>
            </div>
        )}
    </div>
    {/* This is the new Edit button that appears only after an image is uploaded */}
    {coverImage && !isUploading && (
        <label htmlFor="cover-upload" className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-slate-100">
            <Edit className="w-5 h-5 text-slate-600" />
            <input id="cover-upload" name="cover-upload" type="file" className="sr-only" onChange={handleCoverImageUpload} disabled={isUploading} />
        </label>
    )}
</div>
</div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Added Products ({selectedProducts.length})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {selectedProducts.map(product => (
                  <div key={product.id} className="relative group">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-auto aspect-square rounded-lg"/>
                      <button onClick={() => toggleProductSelection(product)} className="absolute top-1 right-1 bg-white/70 p-1 rounded-full opacity-0 group-hover:opacity-100"><X className="w-3 h-3"/></button>
                  </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}