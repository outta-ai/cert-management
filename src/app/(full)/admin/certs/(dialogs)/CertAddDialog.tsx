type DialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function CertAddDialog({ open, onClose }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="z-10 fixed flex justify-center items-center top-0 left-0 w-full h-screen bg-black bg-opacity-50">
      <div className="w-full max-w-xl m-3 bg-white rounded-lg shadow-lg p-6">
        <div className="block lg:hidden">
          <h2>증명서 추가는 PC에서만 가능합니다</h2>
        </div>
      </div>
    </div>
  );
}
